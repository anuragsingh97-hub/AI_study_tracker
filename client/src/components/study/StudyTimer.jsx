import { useState, useEffect } from "react";

export default function StudyTimer() {
  const [seconds, setSeconds] = useState(0);

  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const h = Math.floor(seconds / 3600);

  const m = Math.floor((seconds % 3600) / 60);

  const s = seconds % 60;

  return (
    <div className="bg-slate-900 rounded-3xl p-8">
      <h1 className="text-6xl font-bold text-center text-white">
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
        {String(s).padStart(2, "0")}
      </h1>
    </div>
  );
}
