import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    duration: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "running",
        "paused",
        "completed",
      ],
      default: "running",
    },

    distractionCount: {
      type: Number,
      default: 0,
    },

    focusScore: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "StudySession",
  studySessionSchema
);