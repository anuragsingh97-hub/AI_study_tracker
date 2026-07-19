import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  ShieldCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weekly = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.8 },
  { day: "Wed", hours: 1.2 },
  { day: "Thu", hours: 3.1 },
  { day: "Fri", hours: 2.4 },
  { day: "Sat", hours: 3.8 },
  { day: "Sun", hours: 2.1 },
];
const subjects = [
  { name: "React", value: 34 },
  { name: "DSA", value: 27 },
  { name: "DBMS", value: 18 },
  { name: "OS", value: 12 },
  { name: "Other", value: 9 },
];
const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#64748b"];
const skills = [
  ["React", 82, "bg-blue-500"],
  ["JavaScript", 76, "bg-amber-400"],
  ["DSA", 61, "bg-violet-500"],
  ["DBMS", 48, "bg-emerald-500"],
  ["Operating System", 58, "bg-cyan-500"],
  ["Node.js", 64, "bg-green-500"],
  ["Express", 56, "bg-slate-400"],
  ["MongoDB", 52, "bg-lime-500"],
];

export default function ProfileAnalytics() {
  const calendar = useMemo(
    () =>
      Array.from({ length: 49 }, (_, index) => ({
        level: (index * 7 + 3) % 5,
        title: `${(index % 4) + 1}h study · React`,
      })),
    [],
  );
  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 xl:col-span-2">
        <div className="mb-5">
          <h2 className="font-bold text-white">Weekly Analytics</h2>
          <p className="text-sm text-slate-400">Study time and focus rhythm</p>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekly}>
              <defs>
                <linearGradient id="hours" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#3b82f6"
                fill="url(#hours)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="font-bold text-white">Monthly subjects</h2>
        <p className="text-sm text-slate-400">Time distribution</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subjects}
                dataKey="value"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={3}
              >
                {subjects.map((item, index) => (
                  <Cell key={item.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {subjects.map((item, index) => (
            <span key={item.name} className="text-slate-400">
              <i
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ background: colors[index] }}
              />
              {item.name} {item.value}%
            </span>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="font-bold text-white">Skill Progress</h2>
        <div className="mt-5 space-y-3">
          {skills.map(([name, value, color]) => (
            <div key={name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-300">{name}</span>
                <span className="text-slate-500">{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  className={`h-full rounded-full ${color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 xl:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">Study Calendar</h2>
            <p className="text-sm text-slate-400">
              Your last 7 weeks of activity
            </p>
          </div>
          <CalendarDays className="text-blue-300" />
        </div>
        <div className="mt-5 grid grid-cols-7 gap-2 sm:grid-cols-14">
          {calendar.map((day, index) => (
            <div
              title={day.title}
              key={index}
              className={`aspect-square rounded-md ${["bg-slate-800", "bg-blue-950", "bg-blue-800", "bg-blue-600", "bg-cyan-400"][day.level]}`}
            />
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Hover over a square to see a study session summary.
        </p>
      </section>
      <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 xl:col-span-3">
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <h2 className="font-bold text-white">AI Focus Report</h2>
            <p className="mt-1 text-sm text-slate-400">
              Based on recent monitored sessions
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              [ShieldCheck, "Face detected", "96%"],
              [Flag, "Phone distraction", "4%"],
              [Activity, "Talking detection", "8%"],
              [Clock3, "Looking away", "9%"],
            ].map(([Icon, label, value]) => (
              <div
                key={label}
                className="flex justify-between rounded-xl bg-slate-800 px-3 py-2 text-slate-300"
              >
                <span className="flex gap-2">
                  <Icon size={16} className="text-blue-300" />
                  {label}
                </span>
                <b>{value}</b>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-emerald-500/10 p-5">
            <p className="text-sm text-emerald-300">Productivity</p>
            <p className="mt-1 text-3xl font-bold text-white">Excellent</p>
            <p className="mt-2 text-sm text-slate-400">
              Today 88% · Weekly 84% · Monthly 81%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
