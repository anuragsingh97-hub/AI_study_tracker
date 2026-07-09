import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="h-screen w-full bg-slate-950 flex justify-center items-center">

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
        className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent"
      />

    </div>
  );
};

export default Loader;