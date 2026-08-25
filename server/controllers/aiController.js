import { askAIAssistant } from "../services/aiAssistantService.js";
import { buildAIContext } from "../services/aiContextService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // verifyToken should create req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userId = req.user._id;

    console.log("AI User ID:", userId);

    // Get user's study/quiz/goal data
    const context = await buildAIContext(userId, message);

    // Send personalized context to Gemini
    const response = await askAIAssistant({
      message,
      context,
    });

    return res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get AI response",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
