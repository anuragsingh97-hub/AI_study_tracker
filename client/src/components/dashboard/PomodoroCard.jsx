import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaRedo, FaClock } from "react-icons/fa";

export default function PomodoroCard() {
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      setSeconds(duration * 60);
    }
  }, [duration, running]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const resetTimer = () => {
    setRunning(false);
    setSeconds(duration * 60);
  };

  return (
    <div
      className="bg-slate-900 rounded-3xl border border-slate-800 p-2"
    
    >
     {/* Header */}
<div className="flex items-start justify-between mb-8">

  {/* Left Side */}
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
      <FaClock className="text-blue-400 text-lg" />
    </div>

    <div>
      <h2 className="text-xl font-bold text-white">
        Pomodoro Timer
      </h2>

      <p className="text-sm text-slate-400">
        Stay focused for {duration} minutes
      </p>
    </div>
  </div>

  {/* Right Side */}
  <div className="w-36">
    <label className="block text-xs text-slate-400 mb-1">
      Duration
    </label>

    <select
      value={duration}
      onChange={(e) => setDuration(Number(e.target.value))}
      disabled={running}
      className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value={15}>15 min</option>
      <option value={25}>25 min</option>
      <option value={30}>30 min</option>
      <option value={45}>45 min</option>
      <option value={60}>60 min</option>
      <option value={90}>90 min</option>
    </select>
  </div>

</div>

      {/* Timer */}

      <div className="flex justify-center mb-10">
        <div
          className="h-56 w-56 rounded-full bg-slate-800 border-4 border-blue-500 flex items-center justify-center shadow-lg"
          
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white tracking-wider">
              {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </h1>

            <p className="text-slate-400 mt-2">Focus Session</p>
          </div>
        </div>
      </div>

      {/* Buttons */}

      <div className="grid grid-cols-3 gap-3" >
        <button
          onClick={() => setRunning(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
        >
          <FaPlay />
          Start
        </button>

        <button
          onClick={() => setRunning(false)}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition text-white font-semibold"
        >
          <FaPause />
          Pause
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-white font-semibold"
        >
          <FaRedo />
          Reset
        </button>
      </div>
    </div>
  );
}
