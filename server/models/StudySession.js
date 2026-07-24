import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
    },

    subject: { type: String, required: true, trim: true },
    topic: { type: String, trim: true, default: "" },
    startTime: { type: Date, required: true },
    endTime: Date,
    duration: { type: Number, min: 0, default: 0 },
    focusScore: { type: Number, min: 0, max: 100, default: 0 },

    phoneDetections: Number,

    talkingCount: Number,

    multiplePersonCount: Number,

    faceVisibleTime: Number,

    breakCount: Number,
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("StudySession", studySessionSchema);
