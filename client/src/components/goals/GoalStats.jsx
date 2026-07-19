import { motion } from "framer-motion";
import { CheckCircle2, CircleDotDashed, Clock3, Target } from "lucide-react";

const styles = [
  "from-blue-500/20 to-cyan-500/5 text-blue-300",
  "from-emerald-500/20 to-green-500/5 text-emerald-300",
  "from-violet-500/20 to-purple-500/5 text-violet-300",
  "from-red-500/20 to-orange-500/5 text-red-300",
];
const icons = [Target, CheckCircle2, CircleDotDashed, Clock3];

export default function GoalStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index];
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`rounded-2xl border border-slate-700 bg-gradient-to-br ${styles[index]} p-5`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-300">{stat.title}</p>
              <Icon size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
