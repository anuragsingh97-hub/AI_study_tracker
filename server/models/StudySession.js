import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
    },

    subject: String,

    topic: String,

    startTime: Date,

    endTime: Date,

    duration: Number,

    focusScore: Number,

    phoneDetections: Number,

    talkingCount: Number,

    multiplePersonCount: Number,

    faceVisibleTime: Number,

    breakCount: Number,
  },
  { timestamps: true },
);

export default mongoose.model("StudySession", studySessionSchema);
