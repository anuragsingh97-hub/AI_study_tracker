import { AlertTriangle } from "lucide-react";

export default function WeakSubjects({ subjects, weakTopicsBySubject }) {
  if (!subjects.length) return null;
  return (
    <section className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-white">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-amber-400" />
        <h2 className="text-xl font-bold">Subjects That Need Attention</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {subjects.map((item) => {
          const topics = weakTopicsBySubject[item.subject] ?? [];
          return (
            <article key={item.subject} className="rounded-xl bg-slate-900 p-4">
              <p className="font-semibold">
                {item.subject}{" "}
                <span className="text-rose-400">
                  {Math.round(item.subjectScore)}
                </span>
              </p>
              {topics.length ? (
                <p className="mt-2 text-sm text-slate-300">
                  Weak topics: {topics.map((topic) => topic.topic).join(", ")}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-amber-200">
                {item.recommendation}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
