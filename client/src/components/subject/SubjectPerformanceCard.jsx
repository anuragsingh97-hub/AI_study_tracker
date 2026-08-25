import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const toneFor = (score) =>
  score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#fb7185";

export default function SubjectPerformanceCard({ performance }) {
  const { subject, studyScore, focusScore, quizScore, subjectScore, level } =
    performance;
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold">{subject}</h3>
          <p className="mt-1 text-sm text-slate-400">{level}</p>
        </div>
        <div className="h-16 w-16">
          <CircularProgressbar
            value={subjectScore}
            text={`${Math.round(subjectScore)}`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: toneFor(subjectScore),
              trailColor: "#1e293b",
              textSize: "28px",
            })}
          />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        <Score label="Study" score={studyScore} />
        <Score label="Focus" score={focusScore} />
        <Score label="Quiz" score={quizScore} />
      </div>
    </article>
  );
}

function Score({ label, score }) {
  return (
    <div className="rounded-xl bg-slate-800 p-2">
      <p className="text-slate-400">{label}</p>
      <p className="mt-1 text-base font-bold">{Math.round(score)}</p>
    </div>
  );
}
