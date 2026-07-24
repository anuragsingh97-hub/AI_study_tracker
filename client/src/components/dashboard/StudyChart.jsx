import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { useMemo } from "react";

import { FaChartLine } from "react-icons/fa";

export default function StudyChart({ studies = [] }) {
  const { data, totalHours } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      return {
        day: date.toLocaleDateString(undefined, { weekday: "short" }),
        date: date.toDateString(),
        study: 0,
      };
    });

    studies.forEach((session) => {
      const sessionDate = new Date(session.startTime || session.createdAt);
      const matchingDay = days.find((day) => day.date === sessionDate.toDateString());
      if (matchingDay) matchingDay.study += (Number(session.actualDuration) || 0) / 3600;
    });

    return {
      data: days.map(({ day, study }) => ({ day, study: Number(study.toFixed(2)) })),
      totalHours: days.reduce((total, day) => total + day.study, 0),
    };
  }, [studies]);

  return (
    <div className=" w-full bg-slate-900 rounded-3xl border border-slate-800 p-6" style={{marginTop:"2px"}}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <div className="flex items-center gap-3" style={{margin:"5px"}}>

            <div className="h-11 w-11 rounded-xl bg-blue-500/20 flex items-center justify-center">

              <FaChartLine className="text-blue-400 text-lg" />

            </div>

            <div>

              <h2 className="text-white text-xl font-bold">
                Weekly Analytics
              </h2>

              <p className="text-slate-400 text-sm">
                Study hours this week
              </p>

            </div>

          </div>

        </div>

        <div className="text-right">

          <h3 className="text-3xl font-bold text-white">
            {totalHours.toFixed(1)}h
          </h3>

          <p className="text-sm text-slate-400">
            Total
          </p>

        </div>

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={300}>

        <AreaChart data={data}>

          <defs>

            <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.45} />

              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />

            </linearGradient>

          </defs>

          <CartesianGrid
            stroke="#1E293B"
            vertical={false}
          />

          <XAxis
            dataKey="day"
            tick={{ fill: "#94A3B8" }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{ stroke: "#3B82F6", strokeWidth: 1 }}
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "white",
            }}
          />

          <Area
            type="monotone"
            dataKey="study"
            stroke="none"
            fill="url(#studyGradient)"
          />

          <Line
            type="monotone"
            dataKey="study"
            stroke="#3B82F6"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#3B82F6",
            }}
            activeDot={{
              r: 8,
              stroke: "#fff",
              strokeWidth: 3,
            }}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}
