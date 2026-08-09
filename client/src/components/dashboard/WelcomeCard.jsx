import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const WelcomeCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hour = new Date().getHours();

  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-1 p-1 h-25 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 m-1 shadow-xl"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white" >
            {greeting}, {user?.name}
          </h1>

          <p className="mt-3 text-blue-100 text-lg " >
            Ready to conquer today's study goals?
          </p>
        </div>

        {/* Right */}
        <button className="flex items-center gap-2 rounded-xl bg-white px-2 py-1 font-semibold text-blue-700 transition hover:scale-105 hover:shadow-lg" onClick={() => navigate("/study")}>
          Start Study Session
          
          <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;