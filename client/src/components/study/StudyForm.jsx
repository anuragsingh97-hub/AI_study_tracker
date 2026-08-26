import { motion } from "framer-motion";
import { BookOpen, Target, ClipboardList, CircleCheck } from "lucide-react";

export default function StudyForm({
  subject,
  topic,
  goal,

  setSubject,
  setTopic,
  setGoal,

  disabled,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Session plan</p>
          <h2 className="mt-1 text-xl font-bold text-white">What are you working on?</h2>
        </div>
        <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400"><CircleCheck size={20} /></div>
      </div>

      <div className="space-y-4">
        <Input
          icon={<BookOpen size={20} />}
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Operating System"
          disabled={disabled}
        />

        <Input
          icon={<ClipboardList size={20} />}
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Process Scheduling"
          disabled={disabled}
        />

        <Input
          icon={<Target size={20} />}
          label="Today's Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Complete Chapter 3"
          disabled={disabled}
        />
      </div>
    </motion.div>
  );
}

function Input({
  icon,

  label,

  value,

  onChange,

  placeholder,

  disabled,
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
        <span className="text-blue-400">{icon}</span>{label}
      </label>

      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
