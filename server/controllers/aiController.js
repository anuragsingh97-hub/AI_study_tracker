import { askAIAssistant } from "../services/aiAssistantService.js";
import { buildAIContext } from "../services/aiContextService.js";
import AIChatMessage from "../models/AIChatMessage.js";

export const getChatHistory = async (req, res) => {
  try {
    const messages = await AIChatMessage.find({ user: req.user._id })
      .sort({ createdAt: 1, _id: 1 })
      .select("role text createdAt")
      .lean();

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("AI chat history error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load chat history" });
  }
};

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

    const savedMessages = await AIChatMessage.insertMany([
      { user: userId, role: "user", text: message.trim() },
      { user: userId, role: "assistant", text: response },
    ]);

    return res.status(200).json({
      success: true,
      message: response,
      messages: savedMessages.map(({ role, text, createdAt }) => ({ role, text, createdAt })),
    });
  } catch (error) {
    // Do not log the full Axios error object: it contains request headers,
    // including the Gemini API key.
    console.error("AI Controller Error:", error.message);

    const upstreamStatus = error.upstreamStatus ?? error.response?.status;
    const temporarilyUnavailable = upstreamStatus === 503;
    const rateLimited = upstreamStatus === 429;

    return res.status(rateLimited ? 429 : temporarilyUnavailable ? 503 : 500).json({
      success: false,
      message: error.userMessage || (temporarilyUnavailable
        ? "The AI assistant is temporarily busy. Please try again in a moment."
        : "Failed to get AI response"),
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};
