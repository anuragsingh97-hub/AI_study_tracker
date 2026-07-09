import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import InputField from "./InputField";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const success = await login(form);

    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="w-full px-8 py-8" style={{padding:"10px"}}
    >
      {/* Heading */}

      <h2 className="text-3xl font-bold text-white">
        Welcome Back
      </h2>

      <p className="text-slate-400 mt-2 mb-8">
        Sign in to continue your learning journey.
      </p>

      {/* Inputs */}

      <div className="space-y-5">

        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          name="email"
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          name="password"
          showPassword={showPassword}
          togglePassword={() =>
            setShowPassword(!showPassword)
          }
        />

      </div>

      {/* Forgot Password */}

      <div className="flex justify-end mt-3">

        <Link
          to="/forgot-password"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          Forgot Password?
        </Link>

      </div>

      {/* Login Button */}

      <button
        disabled={loading}
        className="w-full mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-white font-semibold transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60"
      >
        {loading ? "Logging In..." : "Login"}
      </button>

      {/* Divider */}

      <div className="flex items-center gap-4 my-8">

        <div className="flex-1 h-px bg-slate-700"></div>

        <span className="text-slate-500 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-slate-700"></div>

      </div>

      {/* Register */}

      <p className="text-center text-slate-400">

        Don't have an account?{" "}

        <Link
          to="/register"
          className="font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          Create Account
        </Link>

      </p>

    </motion.form>
  );
};

export default LoginForm;