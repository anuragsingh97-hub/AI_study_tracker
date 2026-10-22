import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Profile photos are sent as compressed data URLs. The default 100 KB JSON
// limit is too small for them, while 2 MB still keeps request sizes bounded.
app.use(express.json({ limit: "2mb" }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-study-track.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header include health checks and API tools.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
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
app.use("/api/ai", aiRoutes);
// console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
