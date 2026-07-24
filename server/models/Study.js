import mongoose from "mongoose";

const distractionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "phone",
        "multiple_person",
        "talking",
        "no_face",
        "looking_away",
        "tab_switch",
        "other",
      ],
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number, min: 0, default: 0 },
  },
  { _id: true },
);

const studySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true, trim: true },
    topic: { type: String, trim: true, default: "" },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "abandoned"],
      default: "active",
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    plannedDuration: { type: Number, min: 0, default: 0 },
    actualDuration: { type: Number, min: 0, default: 0 },
    pauseDuration: { type: Number, min: 0, default: 0 },
    pauseCount: { type: Number, min: 0, default: 0 },
    completed: { type: Boolean, default: false },
    focusScore: { type: Number, min: 0, max: 100, default: 0 },
    distractionCount: { type: Number, min: 0, default: 0 },
    distractions: { type: [distractionSchema], default: [] },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Study", studySchema);
