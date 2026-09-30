import axios from "axios";

async function generateGeminiResponse(prompt) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    // Read the key at request time. This works both with local dotenv files
    // and with environment variables injected by the deployment platform.
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
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
    console.error("Gemini Error:", error.response?.status, error.response?.data || error.message);
    throw error;
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
