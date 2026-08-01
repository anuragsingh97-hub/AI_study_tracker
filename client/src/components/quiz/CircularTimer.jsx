import { formatClock } from "../../utils/quizUtils";

export default function CircularTimer({ seconds, totalSeconds }) {
  const progress = totalSeconds ? (seconds / totalSeconds) * 100 : 0;
  const urgent = seconds <= 60;
  return <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${urgent ? "#fb7185" : "#22d3ee"} ${progress * 3.6}deg, #1e293b 0deg)` }}><div className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">{formatClock(seconds)}</div></div>;
}
