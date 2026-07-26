import express from "express";
import { generateQuiz } from "../controllers/quizController.js";
import  verifyToken  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generateQuiz);

export default router;