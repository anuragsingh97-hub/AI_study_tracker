import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const startOfWeek = (date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
};

const progressOf = (goal) => {
  const target = Number(goal?.target) || 0;
  return target ? Math.min(100, Math.round(((Number(goal.completed) || 0) / target) * 100)) : 0;
};

export default function GoalInsights({ goals = [] }) {
  const weekStart = startOfWeek(new Date());
  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dueGoals = goals.filter((goal) => new Date(goal.deadline).toDateString() === date.toDateString());
    const progress = dueGoals.length
      ? Math.round(dueGoals.reduce((total, goal) => total + progressOf(goal), 0) / dueGoals.length)
      : 0;

    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      progress,
      goals: dueGoals.length,
    };
  });
  const weeklyGoals = chartData.reduce((total, day) => total + day.goals, 0);
  const weeklyProgress = weeklyGoals
    ? Math.round(chartData.reduce((total, day) => total + day.progress * day.goals, 0) / weeklyGoals)
    : 0;

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-white">Weekly Goal Progress</h2>
          <p className="text-sm text-slate-400">Progress for goals due Monday through Sunday</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
          {weeklyProgress}% complete
        </span>
      </div>
      {weeklyGoals ? (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} formatter={(value) => [`${value}%`, "Progress"]} />
              <Bar dataKey="progress" fill="#3b82f6" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid h-52 place-items-center rounded-2xl border border-dashed border-slate-700 text-center text-sm text-slate-400">
          No goals are due this week. Add a goal with a deadline this week to see its progress chart.
        </div>
      )}
    </section>
  );
}
