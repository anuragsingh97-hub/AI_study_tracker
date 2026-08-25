import axios from "axios";

async function generateGeminiResponse(prompt) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error) {
    console.error(
      "Gemini Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}

// Existing function - don't break your quiz system
export async function generateQuiz(prompt) {
  return generateGeminiResponse(prompt);
}

// New function for AI Assistant
export async function generateAIResponse(prompt) {
  return generateGeminiResponse(prompt);
}