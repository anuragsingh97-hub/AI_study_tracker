import express from "express";
import {
  createStudy,
  deleteStudy,
  getStudies,
  getStudyById,
  updateStudy,
} from "../controllers/studyController.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyUser);
router.route("/").post(createStudy).get(getStudies);
router.route("/:id").get(getStudyById).put(updateStudy).delete(deleteStudy);

export default router;
