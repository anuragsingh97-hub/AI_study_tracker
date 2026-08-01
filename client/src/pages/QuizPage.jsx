import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import useQuiz from "../hooks/useQuiz";
import { getQuestionKey } from "../utils/quizUtils";
import QuizHeader from "../components/quiz/QuizHeader";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizNavigation from "../components/quiz/QuizNavigation";
import SubmitConfirmationModal from "../components/quiz/SubmitConfirmationModal";
import QuizSkeleton from "../components/quiz/QuizSkeleton";
import QuizState from "../components/quiz/QuizState";

export default function QuizPage() {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const quizState = useQuiz(studyId);
  const { quiz, questions, answers, activeIndex, setActiveIndex, timeLeft, loading, error, submitting, attemptedCount, unansweredCount, selectAnswer, submit, loadQuiz } = quizState;

  const finishSubmission = async (autoSubmit = false) => {
    try {
      const result = await submit(autoSubmit);
      if (result) navigate(`/quiz/${studyId}/result`, { state: { result } });
    } catch { /* Toast is shown by the hook. */ }
  };

  useEffect(() => {
    if (quiz && timeLeft === 0 && !submitting) finishSubmission(true);
  }, [quiz, timeLeft, submitting]); // The hook prevents a duplicate automatic submission.

  let content;
  if (loading) content = <QuizSkeleton />;
  else if (error) content = <QuizState title="Couldn’t load quiz" message={error} action={<button onClick={loadQuiz} className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950">Try again</button>} />;
  else if (!questions.length) content = <QuizState title="No quiz available yet" message="Your study quiz is still being prepared. Please return in a moment." action={<button onClick={() => navigate("/study")} className="rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-950">Back to study</button>} />;
  else {
    const question = questions[activeIndex];
    content = <div className="mx-auto max-w-4xl space-y-5"><QuizHeader quiz={quiz} attemptedCount={attemptedCount} timeLeft={timeLeft} /><QuestionCard question={question} questionNumber={`${activeIndex + 1} of ${questions.length}`} selectedAnswer={answers[getQuestionKey(question, activeIndex)]} onSelect={(answer) => selectAnswer(question, activeIndex, answer)} /><QuizNavigation activeIndex={activeIndex} total={questions.length} submitting={submitting} onPrevious={() => setActiveIndex((index) => Math.max(0, index - 1))} onNext={() => setActiveIndex((index) => Math.min(questions.length - 1, index + 1))} onSubmit={() => setShowConfirm(true)} /><p className="text-center text-sm text-slate-500">{unansweredCount ? `${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"}` : "All questions answered"}</p></div>;
  }
  return <DashboardLayout tittle="Quiz"><div className="min-h-full bg-slate-950 py-2 text-white sm:py-6">{content}<SubmitConfirmationModal open={showConfirm} unansweredCount={unansweredCount} submitting={submitting} onClose={() => setShowConfirm(false)} onConfirm={() => finishSubmission(false)} /></div></DashboardLayout>;
}
