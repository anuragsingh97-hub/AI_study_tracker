import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    goalType: {
      type: String,
      enum: [
        "Study Hours",
        "Chapters",
        "LeetCode Problems",
        "Assignments",
        "Projects",
        "Revision",
        "Mock Tests",
        "Custom",
      ],
      default: "Study Hours",
    },

    target: {
      type: Number,
      required: true,
      min: 1,
    },

    completed: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(value) {
          return value <= this.target;
        },
        message: "Completed value cannot exceed the target",
      },
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    deadline: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    milestones: [milestoneSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Goal", goalSchema);
