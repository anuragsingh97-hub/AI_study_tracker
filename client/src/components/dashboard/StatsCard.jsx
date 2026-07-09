import { motion } from "framer-motion";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="h-48 rounded-2xl border border-slate-800 bg-slate-900 shadow-lg hover:border-blue-500/40 hover:shadow-blue-500/10" style={{margin:"2px"}}
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
       
       

        {/* Title */}
        <p className="text-sm font-medium text-slate-400" style={{marginBottom:"15px"}}>
          {title}
        </p>

        {/* Value */}
        <h2 className="mt-2 text-4xl font-bold text-white">
          {value}
        </h2>

        {/* Subtitle */}
        <p className={`mt-2 text-sm font-medium ${color}`}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;