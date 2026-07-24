import { motion } from "framer-motion";
import { BookOpen, Target, ClipboardList } from "lucide-react";

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
      className="h-60 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl"
      style={{ padding: "9px", margin: "2px" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Study Session</h2>

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
      <label className="text-slate-300 mb-2 flex items-center gap-2">
        {icon}

        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 transition"
      />
    </div>
  );
}
