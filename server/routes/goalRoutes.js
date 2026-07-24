import express from "express";

import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

import  verifyToken  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createGoal);

router.get("/", verifyToken, getGoals);

router.get("/:id", verifyToken, getGoalById);

router.put("/:id", verifyToken, updateGoal);


router.delete("/:id", verifyToken, deleteGoal);

export default router;
