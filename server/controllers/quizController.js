import Quiz from "../models/Quiz.js";
import Study from "../models/Study.js";
import { generateQuizFromTopic } from "../services/quizService.js";

const publicQuiz = (quiz) => {
  const payload = quiz.toObject ? quiz.toObject() : quiz;
  const { questions, answerReview, ...meta } = payload;

  if (payload.completed) {
    return { ...meta, questions: answerReview, review: answerReview };
  }

  // Never expose correct answers or explanations before server-side evaluation.
  return {
    ...meta,
    questions: questions.map(({ question, options, _id }) => ({ _id, question, options })),
  };
};

export const createQuizForStudy = async (study) => {
  const existingQuiz = await Quiz.findOne({ study: study._id, user: study.user });
  if (existingQuiz) return existingQuiz;

  const quizData = await generateQuizFromTopic(study.subject, study.topic, study.notes);
  return Quiz.create({
    user: study.user,
    study: study._id,
    ...quizData,
    subject: quizData.subject ?? study.subject,
    topic: quizData.topic ?? study.topic,
    totalQuestions: quizData.questions.length,
  });
};

export const generateQuiz = async (req, res) => {
  try {
    const { subject, topic, studyId } = req.body;

    if (!studyId) {
      return res.status(400).json({ success: false, message: "studyId is required" });
    }

    const study = await Study.findOne({ _id: studyId, user: req.user.id });
    if (!study) return res.status(404).json({ success: false, message: "Study session not found" });

    const quiz = await createQuizForStudy({ ...study.toObject(), subject: subject ?? study.subject, topic: topic ?? study.topic });

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

export const getQuizByStudyId = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ study: req.params.studyId, user: req.user.id });
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz is not ready yet" });
    return res.json({ success: true, quiz: publicQuiz(quiz) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ study: req.params.studyId, user: req.user.id });
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    if (quiz.completed) return res.status(409).json({ success: false, message: "Quiz has already been submitted" });

    const submittedAnswers = new Map((req.body.answers ?? []).map((item) => [String(item.questionId), item.selectedAnswer]));
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const answerReview = quiz.questions.map((question, index) => {
      const userAnswer = submittedAnswers.get(String(question._id ?? index)) ?? null;
      const isCorrect = userAnswer === question.correctAnswer;
      if (!userAnswer) skipped += 1;
      else if (isCorrect) correct += 1;
      else wrong += 1;
      return { questionId: String(question._id ?? index), question: question.question, userAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation, isCorrect };
    });

    const totalQuestions = quiz.questions.length;
    quiz.correct = correct;
    quiz.wrong = wrong;
    quiz.skipped = skipped;
    quiz.score = correct;
    quiz.accuracy = totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0;
    quiz.timeTaken = Math.max(0, Number(req.body.timeTaken) || 0);
    quiz.weakTopics = wrong + skipped ? [quiz.topic] : [];
    quiz.answerReview = answerReview;
    quiz.completed = true;
    quiz.completedAt = new Date();
    await quiz.save();

    return res.json({ success: true, result: publicQuiz(quiz) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
