import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import InputField from "./InputField";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const temp = {};

    if (!form.name.trim()) {
      temp.name = "Full name is required";
    }

    if (!form.email.trim()) {
      temp.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      temp.email = "Enter a valid email";
    }

    if (!form.password) {
      temp.password = "Password is required";
    } else if (form.password.length < 6) {
      temp.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      temp.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      temp.confirmPassword = "Passwords do not match";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    const success = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });

    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score >= 6) return "Strong";
    if (score >= 4) return "Medium";
    return "Weak";
  };

  const strength = getPasswordStrength(form.password);

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="w-full px-8 py-8"
      style={{ padding: "10px" }}
    >
      {/* Heading */}

      <h2 className="text-3xl font-bold text-white">
        Create Account
      </h2>

      <p className="text-slate-400 mt-2 mb-8">
        Join AI Study Tracker and start your learning journey.
      </p>

      {/* Inputs */}

      <div className="space-y-5">
        <InputField
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        <InputField
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        {strength && (
          <p
            className={`text-sm ${
              strength === "Strong"
                ? "text-green-400"
                : strength === "Medium"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            Password Strength: <strong>{strength}</strong>
          </p>
        )}

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={handleChange}
          showPassword={showConfirm}
          togglePassword={() => setShowConfirm(!showConfirm)}
          error={errors.confirmPassword}
        />
      </div>

      {/* Register Button */}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 text-white font-semibold transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Divider */}

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-slate-700"></div>

        <span className="text-slate-500 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-slate-700"></div>
      </div>

      {/* Login */}

      <p className="text-center text-slate-400">
        Already have an account?{" "}

        <Link
          to="/"
          className="font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          Login
        </Link>
      </p>
    </motion.form>
  );
};

export default RegisterForm;