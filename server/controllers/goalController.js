import Goal from "../models/Goal.js";

const writableFields = [
  "title", "subject", "description", "goalType", "target", "completed",
  "priority", "difficulty", "deadline", "notes", "milestones",
];
const goalPayload = (body) => Object.fromEntries(
  writableFields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]),
);

// Create Goal
export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      ...goalPayload(req.body),
      userId: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Goals

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Single Goal
export const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    // Update the document and save it so schema validation receives both
    // `completed` and `target`. Query validation cannot access the current
    // target value, which previously caused valid edits to be rejected.
    Object.assign(goal, goalPayload(req.body));
    await goal.save();

    res.status(200).json({
      success: true,
      message: "Goal updated",
      goal,
    });
  } catch (error) {
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
