import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiZap,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

const cards = [
  {
    title: "Study Time",
    value: "4h 20m",
    icon: <FiBookOpen />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Focus Score",
    value: "89%",
    icon: <FiZap />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Goals",
    value: "7",
    icon: <FiTarget />,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Growth",
    value: "+18%",
    icon: <FiTrendingUp />,
    color: "from-orange-500 to-red-500",
  },
];

export default function AISummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: cards.indexOf(card) * 0.05 }} whileHover={{ y: -4 }}
          key={card.title}
          className={`bg-gradient-to-r ${card.color} rounded-2xl p-5`}
        >
          <div className="text-3xl mb-4">
            {card.icon}
          </div>

          <p className="text-white/80">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </motion.div>
      ))}
    </div>
  );
}
