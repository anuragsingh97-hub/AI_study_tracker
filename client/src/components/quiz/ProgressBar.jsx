export default function ProgressBar({ current, total }) {
  const progress = total ? (current / total) * 100 : 0;
  return <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800" aria-label={`${current} of ${total} questions answered`}><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>;
}
