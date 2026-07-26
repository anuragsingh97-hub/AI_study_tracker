import axios from "axios";

export async function generateQuiz(prompt) {
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
      response.data.candidates[0].content.parts[0].text;

    return text;
  } catch (error) {
    console.error(
      "Gemini Error:",
      error.response?.data || error.message
    );

    throw error;
  }
}