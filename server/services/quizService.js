import { searchTopic, buildContext } from "./tavilyService.js";
import { createQuizPrompt } from "../prompts/quizPrompt.js";
import { generateQuiz } from "./geminiService.js";
import { parseQuiz } from "../utils/parseQuiz.js";

export async function generateQuizFromTopic(subject, topic, studySummary = "") {

  // Search with Tavily
  const searchData = await searchTopic(subject, topic);

  // Build clean context
  const context = `${studySummary ? `Student study notes/summary:\n${studySummary}\n\n` : ""}${buildContext(searchData)}`;

  // Create AI prompt
  const prompt = createQuizPrompt({
    subject,
    topic,
    difficulty: "Medium",
    numberOfQuestions: 10,
    context,
  });

  // Generate quiz using Gemini
  const quiz = await generateQuiz(prompt);

  return parseQuiz(quiz);
}
