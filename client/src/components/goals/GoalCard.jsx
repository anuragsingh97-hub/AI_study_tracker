import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  Flag,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const statusStyle = {
  Completed: "bg-emerald-500/15 text-emerald-300",
  "In Progress": "bg-blue-500/15 text-blue-300",
  Expired: "bg-red-500/15 text-red-300",
  Pending: "bg-amber-500/15 text-amber-300",
};
const priorityStyle = {
  High: "bg-red-500/15 text-red-300",
  Medium: "bg-amber-500/15 text-amber-300",
  Low: "bg-slate-700 text-slate-300",
};

export default function GoalCard({
  goal,
  status,
  countdown,
  onEdit,
  onDelete,
  onMilestone,
  onAddMilestone,
}) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const progress = Math.min(
    100,
    Math.round((goal.completed / goal.target) * 100),
  );
  const addMilestone = (event) => {
    event.preventDefault();
    if (milestoneTitle.trim()) {
      onAddMilestone(goal.id, milestoneTitle.trim());
      setMilestoneTitle("");
    }
  };
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-lg transition hover:-translate-y-1 hover:border-blue-500/50"
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold text-white">
              {goal.title}
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}
            >
              {status}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-blue-300">
            {goal.subject} · {goal.goalType}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            aria-label="Edit goal"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Edit3 size={17} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal)}
            aria-label="Delete goal"
            className="rounded-lg p-2 text-slate-400 hover:bg-red-500/15 hover:text-red-300"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
        {goal.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle[goal.priority]}`}
        >
          <Flag size={12} />
          {goal.priority}
        </span>
        <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-300">
          {goal.difficulty}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
          <CalendarDays size={12} />
          {countdown}
        </span>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="font-semibold text-white">
            {goal.completed}/{goal.target} · {progress}%
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.55 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          />
        </div>
      </div>
      <div className="mt-5 border-t border-slate-800 pt-4">
        <p className="mb-2 text-sm font-semibold text-slate-200">Milestones</p>
        <div className="space-y-2">
          {goal.milestones.map((milestone) => (
            <label
              key={milestone.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-400"
            >
              <input
                type="checkbox"
                checked={milestone.completed}
                onChange={() => onMilestone(goal.id, milestone.id)}
                className="h-4 w-4 accent-blue-500"
              />
              <span
                className={
                  milestone.completed ? "text-slate-500 line-through" : ""
                }
              >
                {milestone.completed && (
                  <Check className="mr-1 inline text-emerald-400" size={14} />
                )}
                {milestone.title}
              </span>
            </label>
          ))}
        </div>
        <form onSubmit={addMilestone} className="mt-3 flex gap-2">
          <input
            value={milestoneTitle}
            onChange={(event) => setMilestoneTitle(event.target.value)}
            placeholder="Add milestone"
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />
          <button
            className="rounded-lg bg-slate-800 p-2 text-blue-300 hover:bg-slate-700"
            aria-label="Add milestone"
          >
            <Plus size={17} />
          </button>
        </form>
      </div>
      <button
        type="button"
        onClick={() => setNotesOpen(!notesOpen)}
        className="mt-4 flex w-full items-center justify-between rounded-xl bg-slate-800/70 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
      >
        <span>Notes</span>
        <ChevronDown
          className={notesOpen ? "rotate-180 transition" : "transition"}
          size={17}
        />
      </button>
      <AnimatePresence>
        {notesOpen && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-3 pt-2 text-sm leading-6 text-slate-400"
          >
            {goal.notes || "No notes added yet."}
          </motion.p>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => onEdit(goal)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"
      >
        <Eye size={16} />
        View & edit details
      </button>
    </motion.article>
  );
}
