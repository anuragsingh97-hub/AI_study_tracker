import express from "express";
import { chatWithAI, getChatHistory } from "../controllers/aiController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { upload, uploadStudyDocument } from "../controllers/aiDocumentController.js";

const router = express.Router();

router.post("/chat", verifyToken, chatWithAI);
router.get("/history", verifyToken, getChatHistory);
router.post("/documents", verifyToken, upload.single("document"), uploadStudyDocument);

export default router;
