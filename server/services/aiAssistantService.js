import { generateAIResponse } from "./geminiService.js";
import { buildAIAssistantPrompt } from "../prompts/aiAssistantPrompt.js";

export async function askAIAssistant({
  message,
  context = {},
}) {
  const prompt = buildAIAssistantPrompt({
    message,
    context,
  });

  const response = await generateAIResponse(prompt);

  return response;
}