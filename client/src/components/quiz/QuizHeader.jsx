import { BookOpen, Clock3, Layers3 } from "lucide-react";
import CircularTimer from "./CircularTimer";
import ProgressBar from "./ProgressBar";
import { formatDuration } from "../../utils/quizUtils";

export default function QuizHeader({ quiz, attemptedCount, timeLeft }) {
  const questions = quiz.questions ?? [];
  const duration = quiz.studyTime ?? quiz.studyDuration ?? quiz.actualDuration;
  const timeLimit = (quiz.timeLimit ?? quiz.duration ?? 10) * 60;
  return <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="mb-1 text-sm font-medium text-cyan-400">Study assessment</p><h1 className="text-2xl font-bold text-white sm:text-3xl">{quiz.subject}</h1><p className="mt-1 text-slate-400">{quiz.topic}</p></div><CircularTimer seconds={timeLeft} totalSeconds={timeLimit} /></div><div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><Meta icon={<BookOpen size={16} />} label="Difficulty" value={quiz.difficulty ?? "Medium"} /><Meta icon={<Layers3 size={16} />} label="Questions" value={questions.length} /><Meta icon={<Clock3 size={16} />} label="Study time" value={duration ? formatDuration(duration) : "—"} /><Meta icon={<Clock3 size={16} />} label="Answered" value={`${attemptedCount}/${questions.length}`} /></div><div className="mt-6"><ProgressBar current={attemptedCount} total={questions.length} /></div></header>;
}
function Meta({ icon, label, value }) { return <div className="rounded-xl bg-slate-800/70 p-3"><div className="flex items-center gap-1.5 text-slate-400">{icon}<span>{label}</span></div><p className="mt-1 truncate font-semibold text-slate-100">{value}</p></div>; }
