import { motion } from "framer-motion";
import { Sparkles, Quote } from "lucide-react";

const quotes = [
  "Success is the sum of small efforts repeated every day.",

  "Stay focused. Stay disciplined.",

  "Discipline beats motivation.",

  "Every study session brings you closer to your dream.",

  "Consistency creates excellence.",
];

export default function StudyQuote() {
  //   const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-full overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 shadow-xl shadow-blue-950/30"
    >
      <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-white/10" />
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/15 p-2"><Sparkles size={20} /></div>

        <div><p className="text-xs font-bold tracking-[0.16em] text-blue-100">DAILY REMINDER</p><h2 className="font-bold text-white">Keep your momentum</h2></div>
      </div>

      <Quote className="mt-8 text-white/40" size={28} />
      <p className="mt-2 max-w-sm text-lg font-medium leading-7 text-white">Consistency creates excellence.</p>
      <p className="mt-4 text-sm text-blue-100">One focused block at a time.</p>
    </motion.div>
  );
}
