import axios from "axios";

const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
const MAX_ATTEMPTS = 4;
const REQUEST_TIMEOUT_MS = 60_000;

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableGeminiError = (error) => {
  const status = error.response?.status;
  return !status || status === 408 || status === 429 || status >= 500;
};

async function generateGeminiResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

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
      const shouldRetry = attempt < MAX_ATTEMPTS && isRetryableGeminiError(error);

      console.error(
        `Gemini attempt ${attempt}/${MAX_ATTEMPTS} failed:`,
        error.response?.status,
        error.response?.data || error.message,
      );

      if (!shouldRetry) throw error;

      // Exponential backoff plus small jitter avoids synchronized retry bursts.
      const delay = 1_000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
      await wait(delay);
    }
  }
}

// Existing quiz system
export async function generateQuiz(prompt) {
  return generateGeminiResponse(prompt);
}

// AI Assistant
export async function generateAIResponse(prompt) {
  return generateGeminiResponse(prompt);
}
