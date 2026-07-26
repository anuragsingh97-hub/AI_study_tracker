export function createQuizPrompt({
  subject,
  topic,
  difficulty = "Medium",
  numberOfQuestions = 10,
  context,
}) {
  return `
You are an expert teacher and quiz creator.

Your task is to generate a quiz ONLY using the study material provided below.

===========================
Study Material
===========================

${context}

===========================
Instructions
===========================

Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Generate exactly ${numberOfQuestions} multiple-choice questions.

Rules:

1. Use ONLY the study material above.
2. Do NOT use outside knowledge.
3. Each question must have exactly 4 options.
4. Only ONE option is correct.
5. Add a short explanation.
6. Return ONLY valid JSON.
7. Do NOT wrap the JSON in markdown.
8. Do NOT write any extra text.

Return JSON in this format:

{
  "subject": "${subject}",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "",
      "options": [
        "",
        "",
        "",
        ""
      ],
      "correctAnswer": "",
      "explanation": ""
    }
  ]
}
`;
}