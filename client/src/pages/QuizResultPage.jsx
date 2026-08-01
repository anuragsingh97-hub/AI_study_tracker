import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, CircleX, Clock3, RotateCcw, Trophy } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { formatDuration } from "../utils/quizUtils";
import useQuizResult from "../hooks/useQuizResult";

export default function QuizResultPage() {
  const { studyId } = useParams(); const navigate = useNavigate(); const { state } = useLocation();
  const { result, loading } = useQuizResult(studyId, state?.result);
  if (loading) return <DashboardLayout tittle="Quiz results"><div className="py-8 text-center text-slate-400">Loading results…</div></DashboardLayout>;
  if (!result) return <DashboardLayout tittle="Quiz results"><div className="py-8 text-center text-slate-300">Results are available after submitting the quiz. <button onClick={() => navigate(`/quiz/${studyId}`)} className="text-cyan-400">Open quiz</button></div></DashboardLayout>;
  const total = result.totalQuestions ?? result.questions?.length ?? 0;
  const correct = result.correct ?? result.correctAnswers ?? 0;
  const wrong = result.wrong ?? result.incorrect ?? 0;
  const skipped = result.skipped ?? Math.max(0, total - correct - wrong);
  const accuracy = result.accuracy ?? (total ? Math.round((correct / total) * 100) : 0);
  return <DashboardLayout tittle="Quiz results"><main className="mx-auto max-w-4xl py-2 text-white sm:py-6"><section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center sm:p-10"><Trophy className="mx-auto text-amber-400" size={44} /><p className="mt-4 text-slate-400">Quiz complete</p><h1 className="mt-1 text-4xl font-bold">{result.score ?? correct}/{total}</h1><p className="mt-2 text-cyan-400">{accuracy}% accuracy</p></section><section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat icon={<CheckCircle2 />} label="Correct" value={correct} tone="text-emerald-400" /><Stat icon={<CircleX />} label="Wrong" value={wrong} tone="text-rose-400" /><Stat icon={<CircleX />} label="Skipped" value={skipped} tone="text-amber-400" /><Stat icon={<Clock3 />} label="Time taken" value={formatDuration(result.timeTaken ?? 0)} tone="text-cyan-400" /></section><section className="mt-5 rounded-3xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-bold">Recommended revision</h2><div className="mt-3 flex flex-wrap gap-2">{(result.weakTopics ?? []).length ? result.weakTopics.map((topic) => <span key={topic} className="rounded-full bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300">{topic}</span>) : <p className="text-slate-400">No weak topics identified. Keep up the momentum.</p>}</div></section><div className="mt-5 flex flex-wrap justify-center gap-3"><button onClick={() => navigate("/study")} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"><RotateCcw size={18} />Study again</button><button onClick={() => navigate(`/quiz/${studyId}/review`, { state: { result } })} className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white">Review answers</button><button onClick={() => navigate("/dashboard")} className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white">Back to dashboard</button></div></main></DashboardLayout>;
}
function Stat({ icon, label, value, tone }) { return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><div className={tone}>{icon}</div><p className="mt-3 text-sm text-slate-400">{label}</p><p className="mt-1 text-xl font-bold text-white">{value}</p></div>; }
