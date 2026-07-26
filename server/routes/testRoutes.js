import express from "express";
// import { testGemini } from "../services/geminiService.js";
import { searchTopic, buildContext } from "../services/tavilyService.js";
import { generateQuizFromTopic } from "../services/quizService.js";

const router = express.Router();

router.get("/gemini", async (req, res) => {
  const result = await testGemini();
  res.json(result);
});

router.get("/tavily", async (req, res) => {
  try {
    const data = await searchTopic("Operating System", "CPU Scheduling");

    const context = buildContext(data);

    res.json({
      success: true,
      context,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.get("/quiz", async (req, res) => {
  try {
    const quiz = await generateQuizFromTopic(
      "Operating System",
      "CPU Scheduling"
    );

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
