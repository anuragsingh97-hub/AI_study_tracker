import { motion } from "framer-motion";
import { CheckCircle2, Pause, Play, TimerReset } from "lucide-react";

export default function StudyTimer({
  status,
  canStart,
  onStart,
  onPause,
  onFinish,
  studyTime,
  loading = false,
}) {
  const running = status === "running";
  const formattedTime =
    `${String(Math.floor(studyTime / 60)).padStart(2, "0")}:` +
    `${String(studyTime % 60).padStart(2, "0")}`;
  const startLabel = status === "paused" ? "Resume Study" : "Start Study";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
            Focus timer
          </p>
          <h2 className="mt-1 font-semibold text-white">Deep work session</h2>
        </div>
        <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
          <TimerReset size={20} />
        </div>
      </div>
      <div className="my-6 rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 to-transparent py-7 text-center">
        <div className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          {formattedTime}
        </div>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
          {running
            ? "Session in progress"
            : status === "paused"
              ? "Session paused"
              : "Awaiting start"}
        </p>
      </div>

      <div className="grid gap-2.5">
        <button
          type="button"
          onClick={onStart}
          disabled={loading || running || (!canStart && status === "idle")}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={18} />
          {loading ? "Saving..." : startLabel}
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={loading || !running}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pause size={18} />
          Pause Study
        </button>
        <button
          type="button"
          onClick={onFinish}
          disabled={loading || status === "idle" || status === "finished"}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 size={18} />
          Finish Study
        </button>
      </div>

      {status === "idle" && !canStart && (
        <p className="mt-4 text-center text-xs text-amber-300">
          Add a subject, topic, and goal before starting.
        </p>
      )}
    </motion.div>
  );
}
