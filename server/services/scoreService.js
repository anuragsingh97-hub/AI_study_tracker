export function calculateSubjectScores(studies, quizzes) {
  const subjects = {};

  // ============================================
  // 1. COLLECT STUDY + FOCUS DATA
  // ============================================

  studies.forEach((study) => {
    const subject = study.subject?.trim();

    if (!subject) return;

    if (!subjects[subject]) {
      subjects[subject] = {
        subject,

        studySessions: 0,
        totalStudyTime: 0,

        focusScores: [],

        quizAttempts: 0,
        quizAccuracies: [],

        studyScore: 0,
        focusScore: 0,
        quizScore: 0,
        subjectScore: 0,
      };
    }

    subjects[subject].studySessions += 1;

    subjects[subject].totalStudyTime +=
      Number(study.actualDuration || 0);

    subjects[subject].focusScores.push(
      Number(study.focusScore || 0)
    );
  });

  // ============================================
  // 2. COLLECT QUIZ DATA
  // ============================================

  quizzes.forEach((quiz) => {
    const subject = quiz.subject?.trim();

    if (!subject) return;

    if (!subjects[subject]) {
      subjects[subject] = {
        subject,

        studySessions: 0,
        totalStudyTime: 0,

        focusScores: [],

        quizAttempts: 0,
        quizAccuracies: [],

        studyScore: 0,
        focusScore: 0,
        quizScore: 0,
        subjectScore: 0,
      };
    }

    subjects[subject].quizAttempts += 1;

    subjects[subject].quizAccuracies.push(
      Number(quiz.accuracy || 0)
    );
  });

  // ============================================
  // 3. CALCULATE SCORES
  // ============================================

  Object.values(subjects).forEach((subject) => {
    // ------------------------------------------
    // Focus Score
    // ------------------------------------------

    if (subject.focusScores.length > 0) {
      const totalFocus = subject.focusScores.reduce(
        (sum, score) => sum + score,
        0
      );

      subject.focusScore = Math.round(
        totalFocus / subject.focusScores.length
      );
    }

    // ------------------------------------------
    // Quiz Score
    // ------------------------------------------

    if (subject.quizAccuracies.length > 0) {
      const totalQuiz = subject.quizAccuracies.reduce(
        (sum, score) => sum + score,
        0
      );

      subject.quizScore = Math.round(
        totalQuiz / subject.quizAccuracies.length
      );
    }

    // ------------------------------------------
    // Study Score
    // ------------------------------------------

    subject.studyScore = calculateStudyScore(
      subject
    );

    // ------------------------------------------
    // Subject Score
    // ------------------------------------------

    subject.subjectScore = Math.round(
      subject.studyScore * 0.4 +
      subject.focusScore * 0.3 +
      subject.quizScore * 0.3
    );

    // ------------------------------------------
    // Clean internal arrays
    // ------------------------------------------

    delete subject.focusScores;
    delete subject.quizAccuracies;
  });

  return Object.values(subjects);
}


// ==================================================
// STUDY SCORE
// ==================================================

function calculateStudyScore(subject) {
  /*
    Initial version:

    Study consistency is based on number of
    completed study sessions.

    We cap the score at 100.

    10+ sessions = 100
  */

  const sessions = subject.studySessions;

  if (sessions === 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((sessions / 10) * 100)
  );
}

export function getWeakSubjects(subjects) {
  return subjects
    .filter((subject) => subject.subjectScore < 60)
    .sort(
      (a, b) =>
        a.subjectScore - b.subjectScore
    );
}