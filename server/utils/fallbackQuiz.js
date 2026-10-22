const clean = (value, fallback) => String(value ?? "").trim() || fallback;

export function createFallbackQuiz(subject, topic, studySummary = "") {
  const safeSubject = clean(subject, "General Studies");
  const safeTopic = clean(topic, safeSubject);
  const noteHint = clean(studySummary, "your study notes").split(/\s+/).slice(0, 12).join(" ");
  const correct = "Review the study material and apply the key ideas.";
  const questions = [
    [`Which topic is this quiz designed to review?`, safeTopic],
    [`Which subject does this study session belong to?`, safeSubject],
    [`What is the best first step before answering a question about ${safeTopic}?`, correct],
    [`Which resource should guide your answers in this review?`, "The notes from this study session."],
    [`What should you do when a concept in ${safeTopic} is unclear?`, "Revisit the notes and work through an example."],
    [`What is a useful way to check your understanding of ${safeTopic}?`, "Explain the idea in your own words."],
    [`What should you focus on while revising ${safeTopic}?`, "The main concepts, definitions, and examples."],
    [`Which approach best helps you remember ${safeTopic}?`, "Practice recalling the key ideas without looking at notes."],
    [`What should you do after finding an incorrect answer?`, "Review the related concept and try a similar question."],
    [`Which study material was available for this quiz?`, noteHint],
  ];

  return {
    subject: safeSubject,
    topic: safeTopic,
    difficulty: "Medium",
    questions: questions.map(([question, correctAnswer]) => ({
      question,
      options: [
        correctAnswer,
        "Skip the material and guess the answer.",
        "Use an unrelated topic instead.",
        "Avoid reviewing the concept.",
      ],
      correctAnswer,
      explanation: "This review question was created locally because the AI service was unavailable.",
      topic: safeTopic,
    })),
  };
}
