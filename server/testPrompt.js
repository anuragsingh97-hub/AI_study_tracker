import { createQuizPrompt } from "./prompts/quizPrompt.js";

const prompt = createQuizPrompt({
  subject: "Operating System",
  topic: "CPU Scheduling",
  difficulty: "Medium",
  numberOfQuestions: 5,
  context: "CPU Scheduling determines which process gets CPU first...",
});

console.log(prompt);