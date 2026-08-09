import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: [
      {
        type: String,
      },
    ],

    correctAnswer: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },
    topic: { type: String, default: "" },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    study: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Study",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      default: "Medium",
    },

    questions: [questionSchema],

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    weakTopics: { type: [String], default: [] },
    completedAt: { type: Date },
    answerReview: {
      type: [
        {
          questionId: String,
          question: String,
          userAnswer: String,
          correctAnswer: String,
          explanation: String,
          topic: String,
          isCorrect: Boolean,
        },
      ],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quiz", quizSchema);
