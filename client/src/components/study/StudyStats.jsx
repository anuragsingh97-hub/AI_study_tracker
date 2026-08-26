import { motion } from "framer-motion";
import { Timer, Coffee, Target, TrendingUp } from "lucide-react";

export default function StudyStats({
  studyTime,
  pauseCount,
  focusScore,
  sessions,
}) {
  const formattedStudyTime = `${Math.floor(studyTime / 60)}m ${studyTime % 60}s`;
  const stats = [
    { title: "Study time", value: formattedStudyTime, icon: <Timer size={20} />, color: "text-violet-300 bg-violet-400/10" },
    { title: "Breaks", value: pauseCount, icon: <Coffee size={20} />, color: "text-amber-300 bg-amber-400/10" },
    { title: "Focus score", value: `${focusScore}%`, icon: <Target size={20} />, color: "text-emerald-300 bg-emerald-400/10" },
    { title: "Sessions", value: sessions, icon: <TrendingUp size={20} />, color: "text-blue-300 bg-blue-400/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => <div key={stat.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/5"><div className="flex items-center justify-between"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{stat.title}</p><h3 className="mt-2 text-2xl font-bold text-white">{stat.value}</h3></div><div className={`rounded-xl p-3 ${stat.color}`}>{stat.icon}</div></div></div>)}
    </motion.div>
  );
}
