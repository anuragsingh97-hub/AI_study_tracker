import express from "express";
import { generateQuiz, getCompletedQuizzes, getQuizByStudyId, submitQuiz } from "../controllers/quizController.js";
import  verifyToken  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generateQuiz);
router.get("/completed", verifyToken, getCompletedQuizzes);
router.get("/:studyId", verifyToken, getQuizByStudyId);
router.post("/:studyId/submit", verifyToken, submitQuiz);

export default router;
