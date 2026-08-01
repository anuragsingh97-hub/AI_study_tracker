import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import useQuizResult from "../hooks/useQuizResult";

export default function QuizReviewPage() {
  const { studyId } = useParams(); const navigate = useNavigate(); const { state } = useLocation();
  const { result, loading } = useQuizResult(studyId, state?.result);
  const questions = result?.questions ?? result?.review ?? [];
  if (loading) return <DashboardLayout tittle="Review answers"><div className="py-8 text-center text-slate-400">Loading review…</div></DashboardLayout>;
  return <DashboardLayout tittle="Review answers"><main className="mx-auto max-w-4xl py-2 text-white sm:py-6"><button onClick={() => navigate(`/quiz/${studyId}/result`, { state })} className="mb-5 text-sm text-cyan-400">← Back to results</button><h1 className="text-2xl font-bold">Review answers</h1>{questions.length ? <div className="mt-5 space-y-4">{questions.map((item, index) => <article key={item.questionId ?? index} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><p className="font-semibold">{index + 1}. {item.question}</p><p className="mt-4 text-sm text-slate-400">Your answer</p><p className={item.isCorrect ? "text-emerald-400" : "text-rose-400"}>{item.userAnswer ?? "Skipped"}</p><p className="mt-3 text-sm text-slate-400">Correct answer</p><p className="text-emerald-400">{item.correctAnswer}</p>{item.explanation && <p className="mt-4 border-t border-slate-800 pt-4 text-sm leading-6 text-slate-300">{item.explanation}</p>}</article>)}</div> : <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">Detailed review data was not returned by the server. Include evaluated questions in the submit response (or expose a review endpoint) to support persistent answer reviews.</div>}</main></DashboardLayout>;
}
