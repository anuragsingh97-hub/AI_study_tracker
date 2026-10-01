import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import InputField from "./InputField";
import useAuth from "../../hooks/useAuth";
import GoogleLoginButton from "../auth/GoogleLoginButton";
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

    if (loading) return;

    setLoading(true);
    try {
      const success = await login(form);

      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
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
          disabled={loading}
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          name="password"
          disabled={loading}
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
        {loading ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Logging in…</span> : "Login"}
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
      <div className="mt-4">
            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-gray-300 flex-1"></div>

              <span className="text-gray-500 text-sm">OR</span>

              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <GoogleLoginButton />
          </div>

    </motion.form>
  );
};

export default LoginForm;
