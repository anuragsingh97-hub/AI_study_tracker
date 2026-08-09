/**
 * Frontend-only subject scoring helpers.
 * All durations are expected to be in seconds and every returned score is
 * clamped to the inclusive 0–100 range.
 */

const toFiniteNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const nonNegative = (value) => Math.max(0, toFiniteNumber(value));

export const clampScore = (score) =>
  Math.min(100, Math.max(0, toFiniteNumber(score)));

const roundScore = (score) => Number(clampScore(score).toFixed(2));

const matchesSubject = (item, subject) =>
  String(item?.subject ?? "").trim().toLocaleLowerCase() ===
  String(subject ?? "").trim().toLocaleLowerCase();

const getSessionDuration = (session = {}) =>
  nonNegative(
    session.totalTime ?? session.actualDuration ?? session.duration ?? 0,
  );

const getFocusedDuration = (session = {}) => {
  if (session.focusedTime !== undefined) return nonNegative(session.focusedTime);
  if (session.faceVisibleTime !== undefined) return nonNegative(session.faceVisibleTime);

  // Existing Study records currently save a focus score instead of focused time.
  // This fallback keeps Phase 1 compatible while Phase 2 adds precise tracking.
  return getSessionDuration(session) * (clampScore(session.focusScore) / 100);
};

export const calculateFocusScore = (sessionData = {}) => {
  const totalTime = nonNegative(
    sessionData.totalTime ?? sessionData.actualDuration ?? sessionData.duration,
  );
  if (totalTime === 0) return 0;

  const focusedTime = getFocusedDuration(sessionData);
  return roundScore((focusedTime / totalTime) * 100);
};

export const calculateStudyScore = (sessionData = {}) =>
  calculateFocusScore(sessionData);

export const calculateQuizScore = (quiz = {}) => {
  const totalQuestions = nonNegative(quiz.totalQuestions ?? quiz.questions?.length);

  if (totalQuestions && (quiz.correctAnswers !== undefined || quiz.correct !== undefined)) {
    return roundScore(
      (nonNegative(quiz.correctAnswers ?? quiz.correct) / totalQuestions) * 100,
    );
  }

  // `accuracy` is the completed-quiz percentage saved by the current API.
  if (quiz.accuracy !== undefined) return roundScore(quiz.accuracy);

  // Supports the prompt's percentage-style `score` field.
  return quiz.score !== undefined ? roundScore(quiz.score) : 0;
};

export const calculateAverageQuizScore = (quizzes = []) => {
  if (!Array.isArray(quizzes) || quizzes.length === 0) return 0;

  const scores = quizzes.map(calculateQuizScore);
  return roundScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const calculateSubjectScore = (studyScore = 0, quizScore = 0) =>
  roundScore(clampScore(studyScore) * 0.4 + clampScore(quizScore) * 0.6);

export const getSubjectLevel = (score = 0) => {
  const safeScore = clampScore(score);
  if (safeScore >= 90) return "Excellent";
  if (safeScore >= 80) return "Strong";
  if (safeScore >= 70) return "Good";
  if (safeScore >= 60) return "Needs Improvement";
  return "Weak";
};

export const calculateSubjectPerformance = (subject, sessions = [], quizzes = []) => {
  const subjectSessions = Array.isArray(sessions)
    ? sessions.filter((session) => matchesSubject(session, subject))
    : [];
  const subjectQuizzes = Array.isArray(quizzes)
    ? quizzes.filter((quiz) => matchesSubject(quiz, subject))
    : [];

  const totalStudyTime = subjectSessions.reduce(
    (total, session) => total + getSessionDuration(session),
    0,
  );
  const focusedTime = subjectSessions.reduce(
    (total, session) => total + getFocusedDuration(session),
    0,
  );
  const focusScore = totalStudyTime
    ? roundScore((focusedTime / totalStudyTime) * 100)
    : 0;
  const studyScore = calculateStudyScore({ totalTime: totalStudyTime, focusedTime });
  const quizScore = calculateAverageQuizScore(subjectQuizzes);
  const subjectScore = calculateSubjectScore(studyScore, quizScore);

  return {
    subject: String(subject ?? "").trim(),
    studyScore,
    focusScore,
    quizScore,
    subjectScore,
    level: getSubjectLevel(subjectScore),
    totalStudyTime: nonNegative(totalStudyTime),
    focusedTime: nonNegative(focusedTime),
    distractionTime: Math.max(0, totalStudyTime - focusedTime),
    quizAttempts: subjectQuizzes.length,
  };
};

export const calculateTopicPerformance = (quizQuestions = []) => {
  if (!Array.isArray(quizQuestions)) return [];

  const topics = new Map();
  quizQuestions.forEach((question) => {
    const topic = String(question?.topic ?? "").trim();
    if (!topic) return;

    const entry = topics.get(topic) ?? { topic, correct: 0, total: 0 };
    entry.total += 1;
    if (question.correct === true || question.isCorrect === true) entry.correct += 1;
    topics.set(topic, entry);
  });

  return [...topics.values()].map(({ topic, correct, total }) => ({
    topic,
    correct,
    total,
    accuracy: total ? roundScore((correct / total) * 100) : 0,
  }));
};

export const getWeakSubjects = (subjectPerformance = []) =>
  (Array.isArray(subjectPerformance) ? subjectPerformance : [])
    .filter((performance) => clampScore(performance?.subjectScore) < 60)
    .sort((first, second) => first.subjectScore - second.subjectScore);

export const getWeakTopics = (topicPerformance = []) =>
  (Array.isArray(topicPerformance) ? topicPerformance : [])
    .filter((topic) => clampScore(topic?.accuracy) < 60)
    .sort((first, second) => first.accuracy - second.accuracy);

export const generateStudyRecommendation = (subjectPerformance = {}, weakTopics = []) => {
  const subject = subjectPerformance.subject || "this subject";
  const weakTopicNames = (Array.isArray(weakTopics) ? weakTopics : [])
    .map((topic) => (typeof topic === "string" ? topic : topic?.topic))
    .filter(Boolean);
  const actions = [];

  if (clampScore(subjectPerformance.subjectScore) < 60) {
    actions.push(`Your ${subject} performance needs attention.`);
  }
  if (clampScore(subjectPerformance.quizScore) < 60) {
    actions.push("Your quiz accuracy is low.");
  }
  if (clampScore(subjectPerformance.focusScore) < 60) {
    actions.push("Reduce distractions during your next study session.");
  }
  if (weakTopicNames.length) {
    actions.push(`Study ${weakTopicNames[0]} for 30 minutes.`);
    if (weakTopicNames.length > 1) actions.push(`Review ${weakTopicNames.slice(1).join(" and ")}.`);
  }
  actions.push("Take another 10-question quiz.");

  return actions.join(" ");
};
