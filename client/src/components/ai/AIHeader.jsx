import React from "react";
import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";

export default function AIHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
          <FiCpu />
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            AI Study Assistant
          </h1>

          <p className="text-gray-400 mt-1">
            Learn smarter with personalized AI guidance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
        <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>

        <span className="text-green-400 font-medium">
          AI Online
        </span>
      </div>
    </motion.div>
  );
}