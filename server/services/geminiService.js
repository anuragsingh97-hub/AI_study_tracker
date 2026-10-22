import axios from "axios";

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
// A quiz request is part of an interactive flow. Keep retries short and let
// the quiz service use its local fallback when Gemini remains unavailable.
const MAX_ATTEMPTS = 2;
const REQUEST_TIMEOUT_MS = 15_000;
let geminiRequestQueue = Promise.resolve();

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableGeminiError = (error) => {
  const status = error.response?.status;
  return !status || status === 408 || status === 429 || status >= 500;
};

const retryDelayFromError = (error) => {
  const retryAfter = error.response?.headers?.["retry-after"];
  if (retryAfter && !Number.isNaN(Number(retryAfter))) return Number(retryAfter) * 1_000;

  const details = error.response?.data?.error?.details ?? [];
  const retryInfo = details.find((detail) => typeof detail.retryDelay === "string");
  const seconds = Number.parseFloat(retryInfo?.retryDelay);
  return Number.isFinite(seconds) ? seconds * 1_000 : null;
};

const userMessageForGeminiError = (status) => {
  if (status === 429) return "AI quiz generation is temporarily rate limited. Please wait a moment and try again.";
  if (status === 503) return "The AI service is temporarily unavailable. Please try again in a moment.";
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

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      // Read the key at request time. This works both with local dotenv files
      // and with environment variables injected by the deployment platform.
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
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
      const shouldRetry = attempt < MAX_ATTEMPTS && isRetryableGeminiError(error);

      console.error(
        `Gemini attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
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
      const delay = retryDelayFromError(error) ?? (1_000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250));
      await wait(delay);
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
