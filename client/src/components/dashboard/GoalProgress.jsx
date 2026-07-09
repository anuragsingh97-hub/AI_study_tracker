import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaBullseye } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";

export default function GoalProgress() {
  const progress = 72;

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-lg" style={{margin:"2px"}}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8" style={{padding:"5px"}}>

        <div className="p-10 h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <FaBullseye className="text-blue-400 text-xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Daily Goal
          </h2>

          <p className="text-sm text-slate-400">
            Stay focused today
          </p>
        </div>

      </div>

      {/* Progress */}
      <div className="flex justify-center items-center my-8">
  <div className="w-44 h-44">
    <CircularProgressbar
      value={progress}
      text={`${progress}%`}
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

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4 mt-8">

        <div className="bg-slate-800 rounded-2xl p-4 text-center">

          <p className="text-slate-400 text-sm">
            Remaining
          </p>

          <h3 className="text-white text-lg font-semibold">
            2h
          </h3>

        </div>

        <div className="bg-slate-800 rounded-2xl p-4 text-center">

          <p className="text-slate-400 text-sm">
            Completed
          </p>

          <h3 className="text-blue-400 text-lg font-semibold">
            72%
          </h3>

        </div>

      </div>

      <p className="text-center text-slate-500 mt-6 text-sm">
       Keep going! You're close to today's target.
      </p>

    </div>
  );
}