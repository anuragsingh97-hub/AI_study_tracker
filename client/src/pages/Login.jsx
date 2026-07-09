import { motion } from "framer-motion";
import {
  FaBrain,
  FaChartLine,
  FaBullseye,
  FaClock,
} from "react-icons/fa";

import LoginForm from "../components/auth/LoginForm";
import logo from "../assets/brain.png";

const features = [
  {
    icon: <FaChartLine className="text-blue-400 text-xl" />,
    title: "Study Analytics",
    desc: "Track your daily and weekly study performance.",
  },
  {
    icon: <FaClock className="text-cyan-400 text-xl" />,
    title: "Pomodoro Timer",
    desc: "Stay focused with distraction-free sessions.",
  },
  {
    icon: <FaBullseye className="text-purple-400 text-xl" />,
    title: "Goal Tracking",
    desc: "Complete daily goals and maintain your streak.",
  },
  {
    icon: <FaBrain className="text-green-400 text-xl" />,
    title: "AI Assistant",
    desc: "Get personalized study recommendations.",
  },
];

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      {/* Background Blur */}
      <div className="absolute -top-44 -left-44 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="absolute top-1/2 right-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center max-w-7xl w-full">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          className="max-w-xl"
        >



          {/* Logo */}

          <div className="flex items-center gap-6 mb-8">

            <img
              src={logo}
              alt="AI Study Tracker"
              className="w-32 h-32 lg:w-36 lg:h-36 object-contain drop-shadow-2xl"
            />

            <div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                AI Study
              </h1>

              <h2 className="text-4xl font-bold text-blue-400 mt-2">
                Tracker
              </h2>

            </div>

          </div>

          <p className="text-slate-400 text-lg lg:text-xl leading-8 max-w-lg mb-10">
            Study smarter with AI-powered analytics, focus sessions,
            intelligent insights and personalized productivity tracking.
          </p>

          {/* Features */}

          <div className="space-y-4">

            {features.map((item) => (

              <div
                key={item.title}
                className="group flex items-center gap-5 rounded-2xl" style={{margin:"2px"}}
              >

                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">

                  {item.icon}

                </div>

                <div>

                  <h3 className="text-white font-semibold">

                    {item.title}

                  </h3>

                  <p className="text-slate-400 text-sm">

                    {item.desc}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .8 }}
          className="flex justify-center"
        >

          <div className="w-full max-w-md rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-3">

            <LoginForm />

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default Login;