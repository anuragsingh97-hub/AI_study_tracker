import { useState } from "react";
import SubjectPerformanceCard from "./SubjectPerformanceCard";

export default function SubjectPerformance({ performances, loading }) {
  const [showAll, setShowAll] = useState(false);
  const visiblePerformances = showAll ? performances : performances.slice(0, 3);

  return (
    <section className="mt-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Subject Performance</h2>
          <p className="mt-1 text-sm text-slate-400">Study focus and completed quiz results by subject.</p>
        </div>
        {!loading && performances.length > 3 && <button type="button" onClick={() => setShowAll((current) => !current)} className="rounded-xl border border-blue-500/50 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/10">{showAll ? "Show less" : `Show all (${performances.length})`}</button>}
      </div>
      {loading ? (
        <p className="mt-4 text-slate-400">Loading performance…</p>
      ) : performances.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visiblePerformances.map((performance) => (
            <SubjectPerformanceCard
              key={performance.subject}
              performance={performance}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">
          Complete a study session to see subject scores.
        </div>
      )}
    </section>
  );
}
