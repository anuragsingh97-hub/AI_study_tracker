import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getQuizByStudyId, submitQuiz as submitQuizRequest } from "../services/quizService";
import { getQuestionKey, getQuizFromResponse, getResultFromResponse } from "../utils/quizUtils";

const DEFAULT_TIME_LIMIT_SECONDS = 10 * 60;

export default function useQuiz(studyId) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_LIMIT_SECONDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getQuizByStudyId(studyId);
      const fetchedQuiz = getQuizFromResponse(response);
      if (!fetchedQuiz?._id && !fetchedQuiz?.questions) throw new Error("Quiz not found.");
      setQuiz(fetchedQuiz);
      setTimeLeft((fetchedQuiz.timeLimit ?? fetchedQuiz.duration ?? 10) * 60);
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? requestError.message ?? "Unable to load this quiz.");
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  useEffect(() => { loadQuiz(); }, [loadQuiz]);

  const questions = quiz?.questions ?? [];
  const attemptedCount = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);
  const unansweredCount = Math.max(0, questions.length - attemptedCount);
  const selectAnswer = useCallback((question, index, answer) => {
    setAnswers((current) => ({ ...current, [getQuestionKey(question, index)]: answer }));
  }, []);

  const submit = useCallback(async (autoSubmit = false) => {
    if (!quiz || submittedRef.current) return null;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((question, index) => ({
          questionId: getQuestionKey(question, index),
          selectedAnswer: answers[getQuestionKey(question, index)] ?? null,
        })),
        timeTaken: Math.max(0, (quiz.timeLimit ?? quiz.duration ?? 10) * 60 - timeLeft),
        autoSubmitted: autoSubmit,
      };
      const response = await submitQuizRequest(studyId, payload);
      if (autoSubmit) toast("Time is up — your quiz was submitted.");
      return getResultFromResponse(response);
    } catch (requestError) {
      submittedRef.current = false;
      toast.error(requestError.response?.data?.message ?? "Unable to submit quiz. Please try again.");
      throw requestError;
    } finally {
      setSubmitting(false);
    }
  }, [answers, questions, quiz, studyId, timeLeft]);

  useEffect(() => {
    if (loading || !quiz || submitting || submittedRef.current) return undefined;
    if (timeLeft <= 0) return undefined;
    const timer = window.setInterval(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [loading, quiz, submitting, timeLeft]);

  return { quiz, questions, answers, activeIndex, setActiveIndex, timeLeft, loading, error, submitting, attemptedCount, unansweredCount, selectAnswer, submit, loadQuiz };
}
