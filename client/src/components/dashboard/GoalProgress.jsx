import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaBullseye } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";

const progressOf = (goals) => {
  if (!goals.length) return 0;
  return Math.round(goals.reduce((total, goal) => total + Math.min(100, (goal.completed / goal.target) * 100), 0) / goals.length);
};

export default function GoalProgress({ goals = [], title = "Daily Goal", emptyMessage = "No goals due today", loading = false }) {
  const progress = progressOf(goals);
  const primaryGoal = goals[0];
  const remaining = primaryGoal ? Math.max(0, 100 - progress) : 0;

  return <div className="bg-slate-900 rounded-3xl border border-slate-800 p-2 shadow-lg">
    <div className="flex items-center gap-3 mb-8"><div className="p-2 h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><FaBullseye className="text-blue-400 text-xl" /></div><div><h2 className="text-xl font-bold text-white">{title}</h2><p className="text-sm text-slate-400">{loading ? "Loading goals..." : primaryGoal?.title || emptyMessage}</p></div></div>
    <div className="flex justify-center items-center my-8"><div className="w-44 h-44"><CircularProgressbar value={loading ? 0 : progress} text={loading ? "—" : `${progress}%`} styles={buildStyles({ pathColor: "#3B82F6", trailColor: "#1E293B", textColor: "#fff", textSize: "18px", strokeLinecap: "round" })} /></div></div>
    <div className="grid grid-cols-2 gap-4 mt-2"><GoalStat label="Remaining" value={primaryGoal ? `${remaining}%` : "—"} /><GoalStat label="Completed" value={primaryGoal ? `${progress}%` : "—"} blue /></div>
    <p className="text-center text-slate-500 mt-6 text-sm">{goals.length > 1 ? `${goals.length} goals are due in this period.` : primaryGoal ? `Keep going on your ${primaryGoal.goalType} goal.` : emptyMessage}</p>
  </div>;
}

function GoalStat({ label, value, blue = false }) {
  return <div className="bg-slate-800 rounded-2xl p-2 text-center"><p className="text-slate-400 text-sm">{label}</p><h3 className={`text-lg font-semibold ${blue ? "text-blue-400" : "text-white"}`}>{value}</h3></div>;
}
