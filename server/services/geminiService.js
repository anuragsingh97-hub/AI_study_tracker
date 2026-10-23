import axios from "axios";

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
// Only use alternatives when Gemini reports a capacity problem (503). A 429
// quota is associated with the API project, so changing models does not make
// more daily quota available.
const GEMINI_FALLBACK_MODELS = (
  process.env.GEMINI_FALLBACK_MODELS || "gemini-3.6-flash,gemini-3.5-flash-lite"
)
  .split(",")
  .map((model) => model.trim())
  .filter(
    (model, index, models) =>
      model && model !== GEMINI_MODEL && models.indexOf(model) === index,
  );
// A quiz request is part of an interactive flow. Keep retries short and let
// the quiz service use its local fallback when Gemini remains unavailable.
const MAX_ATTEMPTS = 2;
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRY_DELAY_MS = 5_000;
let geminiRequestQueue = Promise.resolve();
let quotaBlockedUntil = 0;

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableGeminiError = (error) => {
  const status = error.response?.status;
  return !status || status === 408 || status === 429 || status >= 500;
};

const isQuotaExhausted = (error) => {
  if (error.response?.status !== 429) return false;
  const message = error.response?.data?.error?.message ?? "";
  return /quota exceeded|plan and billing|free_tier_requests/i.test(message);
};

const retryDelayFromError = (error) => {
  const retryAfter = error.response?.headers?.["retry-after"];
  if (retryAfter && !Number.isNaN(Number(retryAfter)))
    return Number(retryAfter) * 1_000;

  const details = error.response?.data?.error?.details ?? [];
  const retryInfo = details.find(
    (detail) => typeof detail.retryDelay === "string",
  );
  const seconds = Number.parseFloat(retryInfo?.retryDelay);
  return Number.isFinite(seconds) ? seconds * 1_000 : null;
};

const quotaRetryDelay = (error) => retryDelayFromError(error) ?? 5 * 60 * 1_000;

const quotaError = () => {
  const error = new Error(
    "The AI provider's daily quota is exhausted. Please try again after the quota resets.",
  );
  error.upstreamStatus = 429;
  error.userMessage = error.message;
  return error;
};

const userMessageForGeminiError = (status) => {
  if (status === 429)
    return "AI quiz generation is temporarily rate limited. Please wait a moment and try again.";
  if (status === 503)
    return "The AI service is temporarily unavailable. Please try again in a moment.";
  return "Unable to generate the quiz right now. Please try again.";
};

const queueGeminiRequest = async (request) => {
  const previousRequest = geminiRequestQueue;
  let releaseQueue;
  geminiRequestQueue = new Promise((resolve) => {
    releaseQueue = resolve;
  });

  await previousRequest.catch(() => undefined);
  try {
    return await request();
  } finally {
    releaseQueue();
  }
};

async function generateGeminiResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (Date.now() < quotaBlockedUntil) throw quotaError();

  let lastError;
  const models = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS];
  for (const model of models) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        // Read the key at request time. This works both with local dotenv files
        // and with environment variables injected by the deployment platform.
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          },
          {
            timeout: REQUEST_TIMEOUT_MS,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
          },
        );

        const text = response.data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("")
          .trim();

        if (!text) {
          throw new Error("Gemini returned an empty response");
        }

        return text;
      } catch (error) {
        lastError = error;
        if (isQuotaExhausted(error)) {
          // This quota does not clear in a few seconds (the provider can return
          // a retry time of many hours), so do not hold the request open.
          quotaBlockedUntil = Date.now() + quotaRetryDelay(error);
          console.warn(
            "Gemini daily quota exhausted; suppressing further requests until quota may reset.",
          );
          throw quotaError();
        }
        const shouldRetry =
          attempt < MAX_ATTEMPTS && isRetryableGeminiError(error);

        console.error(
          `Gemini model ${model}, attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
          error.response?.status,
          error.response?.data || error.message,
        );

        if (!shouldRetry) {
          // Preserve non-retryable errors, but normalize an exhausted transient
          // error so callers can return its actual upstream status.
          if (!isRetryableGeminiError(error)) throw error;
          break;
        }

        // Gemini may return a RetryInfo delay for 429 responses. Honor it when
        // available, otherwise use exponential backoff with jitter.
        const delay = Math.min(
          retryDelayFromError(error) ??
            1_000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250),
          MAX_RETRY_DELAY_MS,
        );
        await wait(delay);
      }
    }

    // Only capacity errors are candidates for a different model. Do not hide
    // authentication, malformed-request, or ordinary rate-limit failures.
    if (lastError?.response?.status !== 503) break;
    if (model !== models.at(-1)) {
      console.warn(`Gemini model ${model} is busy; trying fallback model.`);
    }
  }

  const status = lastError?.response?.status;
  lastError.upstreamStatus = status;
  lastError.userMessage = userMessageForGeminiError(status);
  throw lastError;
}

// Existing quiz system
export async function generateQuiz(prompt) {
  return queueGeminiRequest(() => generateGeminiResponse(prompt));
}

// AI Assistant
export async function generateAIResponse(prompt) {
  return queueGeminiRequest(() => generateGeminiResponse(prompt));
}
