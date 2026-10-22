import { searchTopic, buildContext } from "./tavilyService.js";
import { createQuizPrompt } from "../prompts/quizPrompt.js";
import { generateQuiz } from "./geminiService.js";
import { parseQuiz } from "../utils/parseQuiz.js";
import { createFallbackQuiz } from "../utils/fallbackQuiz.js";

export async function generateQuizFromTopic(subject, topic, studySummary = "") {
  let searchContext = "";

  // Search enriches a quiz when configured, but it must not prevent quiz
  // creation when Tavily is unavailable or not configured.
  if (process.env.TAVILY_API_KEY) {
    try {
      const searchData = await searchTopic(subject, topic);
      searchContext = buildContext(searchData);
    } catch (error) {
      console.warn("Quiz search unavailable; continuing with study notes.", error.message);
    }
  }

  const context = `${studySummary ? `Student study notes/summary:\n${studySummary}\n\n` : ""}${searchContext}`;

  // Create AI prompt
  const prompt = createQuizPrompt({
    subject,
    topic,
    difficulty: "Medium",
    numberOfQuestions: 10,
    context,
  });

  try {
    const quiz = await generateQuiz(prompt);
    return parseQuiz(quiz);
  } catch (error) {
    // A quota/availability failure should never leave a completed study
    // session stuck on the generating screen. Persist a valid review quiz
    // immediately, then the next session can use Gemini again normally.
    console.warn(
      "Gemini quiz generation unavailable; using local fallback.",
      error.upstreamStatus ?? error.response?.status ?? error.message,
    );
    return createFallbackQuiz(subject, topic, studySummary);
  }
}
