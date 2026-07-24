import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Pause, Play } from "lucide-react";

const INITIAL_TIME = 0;

export default function StudyTimer({
  status,
  canStart,
  onStart,
  onPause,
  onFinish,
  setStudyTime,
  loading = false,
}) {
  const [seconds, setSeconds] = useState(INITIAL_TIME);
  const running = status === "running";

  useEffect(() => {
    if (status === "finished") setSeconds(INITIAL_TIME);
  }, [status]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((previous) => {
        setStudyTime((time) => time + 1);
        return previous + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, setStudyTime]);

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
    seconds % 60,
  ).padStart(2, "0")}`;
  const startLabel = status === "paused" ? "Resume Study" : "Start Study";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl"
      style={{ margin: "2px", padding: "1px" }}
    >
      <p
        className="text-center text-sm font-medium uppercase tracking-[0.2em] text-blue-300"
        style={{ marginTop: "10px" }}
      >
        Focus timer
      </p>
      {/* <h2 className="mt-1 text-center text-2xl font-bold text-white">
        Pomodoro
      </h2> */}
      <div className="py-7 text-center" style={{ marginTop: "15px" }}>
        <div className="text-5xl sm:text-6xl font-bold tracking-tight text-blue-400">
          {formattedTime}
        </div>
      </div>

      <div className="grid gap-3" style={{ marginTop: "10px" }}>
        <button
          type="button"
          onClick={onStart}
          disabled={loading || running || (!canStart && status === "idle")}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={18} />
          {loading ? "Saving..." : startLabel}
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={loading || !running}
          className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pause size={18} />
          Pause Study
        </button>
        <button
          type="button"
          onClick={onFinish}
          disabled={loading || status === "idle" || status === "finished"}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/70 bg-red-500/15 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 size={18} />
          Finish Study
        </button>
      </div>

      {status === "idle" && !canStart && (
        <p
          className="mt-4 text-center text-xs text-amber-300"
          style={{ marginTop: "20px" }}
        >
          Add a subject, topic, and goal before starting.
        </p>
      )}
    </motion.div>
  );
}
