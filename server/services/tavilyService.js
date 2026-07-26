import axios from "axios";

// Search educational content using Tavily
export async function searchTopic(subject, topic) {
  try {
    const query = `${subject} ${topic} tutorial concepts examples`;

    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "basic",

        include_answer: true,

        // MUST BE FALSE
        include_raw_content: false,

        max_results: 3,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Tavily Error:", error.response?.data || error.message);
    throw error;
  }
}

// Convert Tavily response into clean text for Gemini
export function buildContext(data) {
  let context = "";

  // Summary
  if (data.answer) {
    context += `Summary:\n${data.answer}\n\n`;
  }

  // Best 3 sources
  data.results.forEach((item, index) => {
    context += `Source ${index + 1}\n`;
    context += `Title: ${item.title}\n`;

    // Limit content length
    context += `Content: ${item.content.slice(0, 500)}\n\n`;
  });

  return context;
}