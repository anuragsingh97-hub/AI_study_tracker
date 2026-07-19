import { motion } from "framer-motion";
import { Plus, Target } from "lucide-react";

export default function GoalHeader({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
          <Target size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Goals</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track your learning goals and stay consistent.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
      >
        <Plus size={18} />
        Add Goal
      </button>
    </motion.div>
  );
}
