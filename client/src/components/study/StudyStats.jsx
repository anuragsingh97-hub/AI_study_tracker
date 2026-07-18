import { motion } from "framer-motion";
import { Timer, Coffee, Target, TrendingUp } from "lucide-react";

export default function StudyStats({
  studyTime,
  pauseCount,
  focusScore,
  sessions,
}) {
  const formattedStudyTime = `${Math.floor(studyTime / 60)}m ${studyTime % 60}s`;
  const Card = ({ title, value, icon, color }) => (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h2 className="text-white text-2xl font-bold mt-2">{value}</h2>
        </div>

        <div className={`${color} p-3 rounded-xl`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-4 gap-5 mt-8"
    >
      <div
        className=" rounded-xl bg-gray-900 border border-gray-800 shadow-md"
        style={{ padding: "5px" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Study Time</p>
            <h3 className="text-2xl font-bold text-white">
              {formattedStudyTime}
            </h3>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
            <Timer />
          </div>
        </div>
      </div>

      <div
        className=" rounded-xl bg-gray-900 border border-gray-800 shadow-md"
        style={{ padding: "5px" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Breaks</p>
            <h3 className="text-2xl font-bold text-white">{pauseCount}</h3>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
            <Coffee />
          </div>
        </div>
      </div>

      <div
        className=" rounded-xl bg-gray-900 border border-gray-800 shadow-md"
        style={{ padding: "5px" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Focus</p>
            <h3 className="text-2xl font-bold text-white">
              {`${focusScore}%`}
            </h3>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
            <Target />
          </div>
        </div>
      </div>

      <div
        className=" rounded-xl bg-gray-900 border border-gray-800 shadow-md"
        style={{ padding: "5px" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Sessions</p>
            <h3 className="text-2xl font-bold text-white">{sessions}</h3>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
            <TrendingUp />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
