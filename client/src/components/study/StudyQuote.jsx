import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 shadow-xl"style={{padding:"10px",margin:"3px"}}
    >
      <div className="flex items-center gap-3">
        <Sparkles />

        <h2 className="text-xl font-bold text-white">Daily Motivation</h2>
      </div>

      <p className="text-white mt-6 text-lg italic">Consistency creates excellence.</p>
    </motion.div>
  );
}
