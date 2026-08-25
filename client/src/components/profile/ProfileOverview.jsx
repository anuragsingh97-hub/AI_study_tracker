import { BookOpen, Flame, Goal, Trophy } from "lucide-react";

export default function ProfileOverview({ studies = [], goals = [] }) {
  const hours = studies.reduce((sum, item) => sum + (Number(item.actualDuration) || 0), 0) / 3600;
  const complete = goals.filter((goal) => Number(goal.completed) >= Number(goal.target)).length;
  const activity = new Set(studies.filter((item) => item.actualDuration > 0).map((item) => new Date(item.startTime || item.createdAt).toDateString()));
  let streak = 0; const date = new Date(); date.setHours(0, 0, 0, 0);
  while (activity.has(date.toDateString())) { streak += 1; date.setDate(date.getDate() - 1); }
  const stats = [[BookOpen, "Total Study Hours", `${hours.toFixed(1)}h`, `${studies.length} sessions`, "text-blue-300"], [Goal, "Goals Completed", complete, `${goals.length} total goals`, "text-emerald-300"], [Flame, "Current Streak", `${streak} days`, streak ? "Keep your momentum going" : "Study today to start", "text-orange-300"], [Trophy, "Completed Sessions", studies.filter((item) => item.status === "completed").length, "Finished sessions", "text-amber-300"]];
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([Icon, title, value, detail, color]) => <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900 p-5"><div className="flex justify-between"><p className="text-sm text-slate-400">{title}</p><Icon className={color} size={20}/></div><p className="mt-3 text-2xl font-bold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>)}</section>;
}
