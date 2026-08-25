import mongoose from "mongoose";

const studyDocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["note", "pdf"], required: true },
  text: { type: String, required: true },
  chunks: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model("StudyDocument", studyDocumentSchema);
