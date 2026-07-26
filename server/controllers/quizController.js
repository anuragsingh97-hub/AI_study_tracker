import Quiz from "../models/Quiz.js";
import { generateQuizFromTopic } from "../services/quizService.js";

export const generateQuiz = async (req, res) => {
  try {
    const { subject, topic } = req.body;

    const quizData = await generateQuizFromTopic(subject, topic);

    const quiz = await Quiz.create({
      user: req.user.id,
      ...quizData,
      totalQuestions: quizData.questions.length,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};