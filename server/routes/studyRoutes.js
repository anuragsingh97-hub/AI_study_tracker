import express from "express";

import {
  startSession,
  endSession,
  getSessions,
} from "../controllers/studyController.js";

import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", verifyUser, startSession);

router.put("/end/:id", verifyUser, endSession);

router.get("/", verifyUser, getSessions);

export default router;