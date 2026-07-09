import { motion } from "framer-motion";
import {
  FaChartLine,
  FaRobot,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import RegisterForm from "../components/auth/RegisterForm";
import logo from "../assets/brain.png";

const features = [
  {
    icon: <FaChartLine />,
    title: "Track Study Progress",
    desc: "Visual dashboards and analytics.",
  },
  {
    icon: <FaClock />,
    title: "Focus Sessions",
    desc: "Stay productive with Pomodoro.",
  },
  {
    icon: <FaRobot />,
    title: "AI Assistant",
    desc: "Get personalized study guidance.",
  },
];

const Register = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden">

      {/* Background Blur */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

        <div className="grid lg:grid-cols-2 gap-20 max-w-7xl w-full items-center">

          {/* Left Side */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
          >

            {/* Logo */}

            <div className="flex items-center" style={{}}>

              <img
                src={logo}
                alt="AI Study Tracker"
                className="object-contain" style={{height:"200px",width:"200px"}}
              />

              <div>

                <h1 className="text-5xl lg:text-6xl font-black text-white">
                  Join AI Study
                </h1>

                <p className="text-blue-400 text-xl mt-4" style={{marginTop:"10px"}}>
                  Learn Better. Stay Consistent.
                </p>

              </div>

            </div>

            <p className="text-slate-400 text-lg max-w-lg" style={{marginTop:"-10px"}}>
              Create your free account and transform the way you study using
              intelligent analytics, AI assistance and productivity tools.
            </p>

            {/* Features */}

            <div className="space-y-5">

              {features.map((item) => (

                <div
                  key={item.title}
                  className="flex items-start gap-4"
                >

                  <div className="h-12 w-12 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 text-lg">

                    {item.icon}

                  </div>

                  <div>

                    <h3 className="text-white font-semibold text-lg">

                      {item.title}

                    </h3>

                    <p className="text-slate-400">

                      {item.desc}

                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* CTA */}

            <div className="mt-12 inline-flex items-center gap-3 text-blue-400 font-semibold">

              Start your learning journey

              <FaArrowRight />

            </div>

          </motion.div>

          {/* Right Side */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            className="relative"
          >

            {/* Glow */}

            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"></div>

            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>

            {/* Form */}

            

              <RegisterForm />

            

          </motion.div>

        </div>

      </div>

    </div>
  );
};

export default Register;