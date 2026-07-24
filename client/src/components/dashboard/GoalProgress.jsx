import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaBullseye } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";

const progressOf = (goals) => {
  if (!goals.length) return 0;
  return Math.round(
    goals.reduce((total, goal) => total + Math.min(100, (goal.completed / goal.target) * 100), 0) /
      goals.length,
  );
};

export default function GoalProgress({ goals, loading = false }) {
  console.log("golll",goals)
  const progress = goals;
  const primaryGoal = goals;
  const remaining = primaryGoal ? Math.max(0, 100 - primaryGoal) : 0;

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-lg" style={{ margin: "2px" }}>
      <div className="flex items-center gap-3 mb-8" style={{ padding: "5px" }}>
        <div className="p-10 h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <FaBullseye className="text-blue-400 text-xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Daily Goal</h2>
          <p className="text-sm text-slate-400">
            {loading ? "Loading goals..." : primaryGoal ? primaryGoal.title : "No goal due today"}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center my-8">
        <div className="w-44 h-44">
          <CircularProgressbar
            value={loading ? 0 : progress}
            text={loading ? "—" : `${progress}%`}
            styles={buildStyles({
              pathColor: "#3B82F6",
              trailColor: "#1E293B",
              textColor: "#fff",
              textSize: "18px",
              strokeLinecap: "round",
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <p className="text-slate-400 text-sm">Remaining</p>
          <h3 className="text-white text-lg font-semibold">
            {primaryGoal ? `${remaining} of ${100}%` : "—"}
          </h3>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <p className="text-slate-400 text-sm">Completed</p>
          <h3 className="text-blue-400 text-lg font-semibold">
            {primaryGoal ? `${primaryGoal}%` : "—"}
          </h3>
        </div>
      </div>

      <p className="text-center text-slate-500 mt-6 text-sm">
        {goals.length > 1 ? `${goals.length} goals are due today.` : primaryGoal ? `Keep going on your ${primaryGoal.goalType} goal.` : "Create a goal with today's deadline to track it here."}
      </p>
    </div>
  );
}
