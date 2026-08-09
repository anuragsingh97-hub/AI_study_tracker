import SubjectPerformanceCard from "./SubjectPerformanceCard";

export default function SubjectPerformance({ performances, loading }) {
  return <section className="mt-5"><h2 className="text-xl font-bold text-white">Subject Performance</h2><p className="mt-1 text-sm text-slate-400">Study focus and completed quiz results by subject.</p>
    {loading ? <p className="mt-4 text-slate-400">Loading performance…</p> : performances.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{performances.map((performance) => <SubjectPerformanceCard key={performance.subject} performance={performance} />)}</div> : <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-slate-400">Complete a study session to see subject scores.</div>}
  </section>;
}
