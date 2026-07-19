import { motion } from "framer-motion";
import { Award, Bot, Flame, Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", progress: 35 },
  { day: "Tue", progress: 58 },
  { day: "Wed", progress: 44 },
  { day: "Thu", progress: 73 },
  { day: "Fri", progress: 66 },
  { day: "Sat", progress: 82 },
  { day: "Sun", progress: 70 },
];

export default function GoalInsights() {
  const targets = [
    [
      "Today's Target",
      "2h 30m",
      "1h 10m completed",
      "1h 20m remaining",
      "from-cyan-500/20 to-blue-500/5",
    ],
    [
      "Weekly Goal",
      "12 hours",
      "8h 25m completed",
      "3h 35m remaining",
      "from-violet-500/20 to-purple-500/5",
    ],
    [
      "Monthly Goal",
      "50 hours",
      "31h completed",
      "19h remaining",
      "from-emerald-500/20 to-green-500/5",
    ],
  ];
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 via-slate-900 to-violet-600/15 p-6 xl:col-span-2"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/20 p-2 text-blue-200">
            <Bot />
          </div>
          <div>
            <h2 className="font-bold text-white">AI Study Coach</h2>
            <p className="text-sm text-blue-200/70">
              Personal recommendations based on your goals
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            "You spent only 4 hours on DSA this week.",
            "Increase it to 8 hours to complete your goal.",
            "Recommended: Study DBMS for 1 hour tomorrow.",
          ].map((tip) => (
            <p
              key={tip}
              className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm leading-6 text-slate-200"
            >
              {tip}
            </p>
          ))}
        </div>
      </motion.section>
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="font-bold text-white">Achievements</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            [Trophy, "First Goal"],
            [Flame, "7 Day Streak"],
            [Award, "100 Study Hours"],
            [Award, "React Master"],
          ].map(([Icon, text]) => (
            <div
              key={text}
              className="rounded-xl bg-slate-800 p-3 text-center text-xs text-slate-300"
            >
              <Icon className="mx-auto mb-1 text-amber-300" size={20} />
              {text}
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3 xl:col-span-3">
        {targets.map(([title, target, complete, remaining, gradient]) => (
          <div
            key={title}
            className={`rounded-3xl border border-slate-700 bg-gradient-to-br ${gradient} p-5`}
          >
            <p className="text-sm text-slate-300">{title}</p>
            <p className="mt-2 text-2xl font-bold text-white">{target}</p>
            <div className="mt-4 flex justify-between text-xs">
              <span className="text-emerald-300">{complete}</span>
              <span className="text-slate-400">{remaining}</span>
            </div>
          </div>
        ))}
      </section>
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 xl:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">Weekly Goal Progress</h2>
            <p className="text-sm text-slate-400">
              Your completion percentage this week
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
            70% complete
          </span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                stroke="#334155"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="progress" fill="#3b82f6" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
