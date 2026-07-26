import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Study Tracker Backend Running 🚀",
  });
});

app.use("/api/auth",authRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/test", testRoutes);
app.use("/api/quiz", quizRoutes);
// console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});