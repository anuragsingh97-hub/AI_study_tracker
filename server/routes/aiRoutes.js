import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { upload, uploadStudyDocument } from "../controllers/aiDocumentController.js";

const router = express.Router();

router.post("/chat", verifyToken, chatWithAI);
router.post("/documents", verifyToken, upload.single("document"), uploadStudyDocument);

export default router;
