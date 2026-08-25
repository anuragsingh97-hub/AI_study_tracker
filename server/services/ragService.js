import StudyDocument from "../models/StudyDocument.js";

const chunkText = (text, size = 900) => {
  const words = String(text).replace(/\s+/g, " ").trim().split(" ");
  const chunks = [];
  for (let index = 0; index < words.length; index += size / 6) {
    const chunk = words.slice(index, index + size / 6).join(" ");
    if (chunk) chunks.push(chunk);
  }
  return chunks;
};

export const saveStudyDocument = async ({ userId, name, type, text }) => {
  const cleanText = String(text ?? "").replace(/\s+/g, " ").trim();
  if (cleanText.length < 20) throw new Error("The document does not contain enough readable text.");
  return StudyDocument.create({ user: userId, name, type, text: cleanText, chunks: chunkText(cleanText) });
};

export const retrieveRelevantNotes = async (userId, query, limit = 4) => {
  const terms = [...new Set(String(query).toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])];
  if (!terms.length) return [];
  const documents = await StudyDocument.find({ user: userId }).sort({ updatedAt: -1 }).limit(20).select("name chunks").lean();
  return documents.flatMap((document) => document.chunks.map((text) => ({ name: document.name, text, score: terms.reduce((score, term) => score + (text.toLowerCase().match(new RegExp(`\\b${term}\\b`, "g"))?.length ?? 0), 0) }))).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(({ name, text }) => ({ name, excerpt: text }));
};
