import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Quiz from "../models/Quiz.js";
import Study from "../models/Study.js";

import { calculateSubjectScores, getWeakSubjects } from "./scoreService.js";
import { retrieveRelevantNotes } from "./ragService.js";

export async function buildAIContext(userId, question = "") {
  try {
    // --------------------------------------------------
    // 1. USER
    // --------------------------------------------------

    const user = await User.findById(userId)
      .select(
        "name college branch semester studyStreak totalStudyHours focusScore preferences",
      )
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    // --------------------------------------------------
    // 2. RECENT STUDY DATA
    // --------------------------------------------------

    const recentStudies = await Study.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "subject topic status startTime endTime plannedDuration actualDuration focusedTime phoneTime talkingTime awayTime multiplePersonTime pauseDuration pauseCount completed focusScore distractionCount distractions",
      )
      .lean();

    // --------------------------------------------------
    // 3. RECENT QUIZ DATA
    // --------------------------------------------------

    const recentQuizzes = await Quiz.find({
      user: userId,
      completed: true,
    })
      .sort({ completedAt: -1 })
      .limit(20)
      .select(
        "subject topic difficulty score totalQuestions correct wrong skipped accuracy timeTaken weakTopics completedAt answerReview",
      )
      .lean();

    // --------------------------------------------------
    // 4. ACTIVE / RECENT GOALS
    // --------------------------------------------------

    const goals = await Goal.find({
      userId: userId,
    })
      .sort({ deadline: 1 })
      .limit(20)
      .select(
        "title subject description goalType target completed priority difficulty deadline notes milestones createdAt",
      )
      .lean();

    // --------------------------------------------------
    // 5. SUBJECT SUMMARY
    // --------------------------------------------------

    const subjectSummary = calculateSubjectScores(recentStudies, recentQuizzes);

    // --------------------------------------------------
    // 6. FINAL AI CONTEXT
    // --------------------------------------------------
    const subjects = calculateSubjectScores(recentStudies, recentQuizzes);

    const weakSubjects = getWeakSubjects(subjects);
    const relevantNotes = await retrieveRelevantNotes(userId, question);
    return {
      user: {
        name: user.name,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        studyStreak: user.studyStreak,
        totalStudyHours: user.totalStudyHours,
        overallFocusScore: user.focusScore,
      },

      subjects,

      weakSubjects,

      recentStudies,

      recentQuizzes,

      goals,
      relevantNotes,
    };
  } catch (error) {
    console.error("AI Context Error:", error);
    throw error;
  }
}

// ======================================================
// SUBJECT SUMMARY
// ======================================================

function buildSubjectSummary(studies, quizzes) {
  const subjects = {};

  // --------------------------------------------------
  // STUDY DATA
  // --------------------------------------------------

  studies.forEach((study) => {
    const subject = study.subject;

    if (!subject) return;

    if (!subjects[subject]) {
      subjects[subject] = {
        subject,
        studySessions: 0,
        totalStudyMinutes: 0,
        totalFocusedMinutes: 0,
        averageFocusScore: 0,
        focusScoreTotal: 0,
        quizAttempts: 0,
        averageQuizAccuracy: 0,
        quizAccuracyTotal: 0,
      };
    }

    subjects[subject].studySessions += 1;

    subjects[subject].totalStudyMinutes += Number(study.actualDuration || 0);

    subjects[subject].totalFocusedMinutes += Number(study.focusedTime || 0);

    subjects[subject].focusScoreTotal += Number(study.focusScore || 0);
  });

  // --------------------------------------------------
  // QUIZ DATA
  // --------------------------------------------------

  quizzes.forEach((quiz) => {
    const subject = quiz.subject;

    if (!subject) return;

    if (!subjects[subject]) {
      subjects[subject] = {
        subject,
        studySessions: 0,
        totalStudyMinutes: 0,
        totalFocusedMinutes: 0,
        averageFocusScore: 0,
        focusScoreTotal: 0,
        quizAttempts: 0,
        averageQuizAccuracy: 0,
        quizAccuracyTotal: 0,
      };
    }

    subjects[subject].quizAttempts += 1;

    subjects[subject].quizAccuracyTotal += Number(quiz.accuracy || 0);
  });

  // --------------------------------------------------
  // CALCULATE AVERAGES
  // --------------------------------------------------

  Object.values(subjects).forEach((subject) => {
    if (subject.studySessions > 0) {
      subject.averageFocusScore = Math.round(
        subject.focusScoreTotal / subject.studySessions,
      );
    }

    if (subject.quizAttempts > 0) {
      subject.averageQuizAccuracy = Math.round(
        subject.quizAccuracyTotal / subject.quizAttempts,
      );
    }

    delete subject.focusScoreTotal;
    delete subject.quizAccuracyTotal;
  });

  return Object.values(subjects);
}
