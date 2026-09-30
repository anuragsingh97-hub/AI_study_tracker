import axios from "axios";

async function generateGeminiResponse(prompt) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
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
      "Gemini Error Status:",
      error.response?.status
    );

    console.error(
      "Gemini Error Data:",
      JSON.stringify(error.response?.data, null, 2)
    );

    console.error(
      "Gemini Error Message:",
      error.message
    );

    throw error;
  }
}

// Existing quiz function
export async function generateQuiz(prompt) {
  return generateGeminiResponse(prompt);
}

// AI Assistant
export async function generateAIResponse(prompt) {
  return generateGeminiResponse(prompt);
}