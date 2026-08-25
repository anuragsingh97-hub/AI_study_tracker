import multer from "multer";
import { PDFParse } from "pdf-parse";
import { saveStudyDocument } from "../services/ragService.js";

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export const uploadStudyDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "Attach a PDF or text file." });
    let text = "";
    if (file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: file.buffer });
      const result = await parser.getText();
      text = result.text;
      await parser.destroy();
    } else if (file.mimetype.startsWith("text/")) {
      text = file.buffer.toString("utf8");
    } else {
      return res.status(400).json({ success: false, message: "Only PDF and text files are supported." });
    }
    const document = await saveStudyDocument({ userId: req.user._id, name: file.originalname, type: file.mimetype === "application/pdf" ? "pdf" : "note", text });
    return res.status(201).json({ success: true, document: { id: document._id, name: document.name, type: document.type } });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Unable to process the document." });
  }
};
