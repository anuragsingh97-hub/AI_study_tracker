import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import StudyForm from "../components/study/StudyForm";
import StudyTimer from "../components/study/StudyTimer";
import CameraPreview from "../components/study/CameraPreview";
import FaceStatus from "../components/study/FaceStatus";
import StudyStats from "../components/study/StudyStats";
import StudyNotes from "../components/study/StudyNotes";
import StudyQuote from "../components/study/StudyQuote";
import StudySummaryModal from "../components/study/StudySummaryModal";
import QuizGenerating from "../components/study/QuizGenerating";
import useFaceDetection from "../hooks/useFaceDetection";
import useFaceLandmarker from "../hooks/useFaceLandmarker";
import useYOLODetection from "../hooks/useYOLODetection";
import useVoiceDetection from "../hooks/useVoiceDetection";
import { createStudy, updateStudy } from "../api/studyApi";
import { calculateFocusScore } from "../utils/scoreCalculator";

export default function StudyPage() {
  const navigate = useNavigate();
  // -------------------------------
  // Session Information
  // -------------------------------

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState("");

  const [notes, setNotes] = useState("");

  const [sessionStatus, setSessionStatus] = useState("idle");
  const [showSummary, setShowSummary] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [pauseDuration, setPauseDuration] = useState(0);
  const [sessionError, setSessionError] = useState("");
  const [saving, setSaving] = useState(false);
  const pauseStartedAt = useRef(null);

  // -------------------------------
  // Webcam
  // -------------------------------

  const videoRef = useRef(null);

  // Temporary AI states
  // These will later come from useFaceDetection()
  const monitoringActive = sessionStatus === "running";
  const { objects, phoneDetected } = useYOLODetection(
    videoRef,
    monitoringActive,
  );
  const { voiceDetected, microphoneStatus } =
    useVoiceDetection(monitoringActive);
  const { faceDetected, faceCount, detections } = useFaceDetection(
    videoRef,
    monitoringActive,
  );
  const { headPose } = useFaceLandmarker(videoRef, monitoringActive);

  const faceVisible = faceDetected && headPose.direction !== "No Face";
  const lookingAway = !faceVisible || headPose.lookingAway;
  // Face detection is more reliable than a general object detector for
  // deciding whether another person is present in a webcam view.
  const multipleFaces = faceCount > 1;

  // -------------------------------
  // Statistics
  // -------------------------------

  const [pauseCount, setPauseCount] = useState(0);
  const [sessions] = useState(0);
  const canStart = Boolean(subject.trim() && topic.trim() && goal.trim());

  // -------------------------------
  // Focus Score
  // -------------------------------
  const [studyTime, setStudyTime] = useState(0);
  // Keep the clock based on real timestamps. setInterval is only used to
  // refresh the UI, because browsers can delay interval callbacks while the
  // page is busy (for example, while camera detection is running).
  const accumulatedStudyTime = useRef(0);
  const runningStartedAt = useRef(null);
  const sessionMetricsRef = useRef({
    focusedTime: 0,
    phoneTime: 0,
    talkingTime: 0,
    awayTime: 0,
    multiplePersonTime: 0,
  });

  const currentStudyTime = useCallback(() => {
    if (!runningStartedAt.current) return accumulatedStudyTime.current;

    return Math.max(
      0,
      accumulatedStudyTime.current +
        Math.floor((Date.now() - runningStartedAt.current) / 1000),
    );
  }, []);

  useEffect(() => {
    if (sessionStatus !== "running") return;

    const refreshClock = () => setStudyTime(currentStudyTime());
    refreshClock();
    const timer = window.setInterval(refreshClock, 250);

    return () => window.clearInterval(timer);
  }, [currentStudyTime, sessionStatus]);

  useEffect(() => {
    if (sessionStatus !== "running") return;

    const timer = setInterval(() => {
      const metrics = sessionMetricsRef.current;
      if (phoneDetected) metrics.phoneTime += 1;
      if (voiceDetected) metrics.talkingTime += 1;
      if (lookingAway) metrics.awayTime += 1;
      if (multipleFaces) metrics.multiplePersonTime += 1;
      if (faceVisible && !phoneDetected && !voiceDetected && !lookingAway && !multipleFaces) {
        metrics.focusedTime += 1;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStatus, faceVisible, lookingAway, multipleFaces, phoneDetected, voiceDetected]);

  const focusScore = useMemo(() => {
    // Focus cannot be verified while the camera cannot see the user.
    if (!faceVisible) return 0;

    let score = 100;

    if (lookingAway) score -= 25;
    if (phoneDetected) score -= 20;
    if (multipleFaces) score -= 15;

    return Math.max(score, 0);
  }, [faceVisible, phoneDetected, lookingAway, multipleFaces]);

  const startStudy = useCallback(async () => {
    if (sessionStatus === "paused") {
      const resumedPauseDuration =
        pauseDuration +
        Math.floor((Date.now() - pauseStartedAt.current) / 1000);

      setSaving(true);
      setSessionError("");
      try {
        await updateStudy(sessionId, {
          status: "active",
          pauseDuration: resumedPauseDuration,
        });
        setPauseDuration(resumedPauseDuration);
        pauseStartedAt.current = null;
        runningStartedAt.current = Date.now();
        setSessionStatus("running");
      } catch (error) {
        setSessionError(
          error.response?.data?.message ||
            "Unable to resume the study session.",
        );
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!canStart || sessionStatus !== "idle") return;

    setSaving(true);
    setSessionError("");
    try {
      const response = await createStudy({
        subject: subject.trim(),
        topic: topic.trim(),
        plannedDuration: 25 * 60,
      });
      setSessionId(response.data.study._id);
      setStudyTime(0);
      accumulatedStudyTime.current = 0;
      runningStartedAt.current = Date.now();
      sessionMetricsRef.current = {
        focusedTime: 0,
        phoneTime: 0,
        talkingTime: 0,
        awayTime: 0,
        multiplePersonTime: 0,
      };
      setPauseCount(0);
      setPauseDuration(0);
      setSessionStatus("running");
    } catch (error) {
      setSessionError(
        error.response?.data?.message || "Unable to start the study session.",
      );
    } finally {
      setSaving(false);
    }
  }, [canStart, pauseDuration, sessionId, sessionStatus, subject, topic]);

  const pauseStudy = useCallback(async () => {
    if (sessionStatus !== "running" || !sessionId) return;

    const elapsedStudyTime = currentStudyTime();
    accumulatedStudyTime.current = elapsedStudyTime;
    runningStartedAt.current = null;
    setStudyTime(elapsedStudyTime);
    const nextPauseCount = pauseCount + 1;
    setSessionStatus("paused");
    pauseStartedAt.current = Date.now();
    setPauseCount(nextPauseCount);
    setSaving(true);
    setSessionError("");

    try {
      await updateStudy(sessionId, {
        status: "paused",
        pauseCount: nextPauseCount,
        pauseDuration,
      });
    } catch (error) {
      pauseStartedAt.current = null;
      setPauseCount(pauseCount);
      runningStartedAt.current = Date.now();
      setSessionStatus("running");
      setSessionError(
        error.response?.data?.message || "Unable to pause the study session.",
      );
    } finally {
      setSaving(false);
    }
  }, [currentStudyTime, pauseCount, pauseDuration, sessionId, sessionStatus]);

  const finishStudy = useCallback(async () => {
    if (["idle", "finished", "generating"].includes(sessionStatus) || !sessionId) return;

    const finalPauseDuration = pauseStartedAt.current
      ? pauseDuration + Math.floor((Date.now() - pauseStartedAt.current) / 1000)
      : pauseDuration;
    const finalStudyTime = currentStudyTime();
    accumulatedStudyTime.current = finalStudyTime;
    runningStartedAt.current = null;
    setStudyTime(finalStudyTime);

    // Change state before awaiting the API request so the timer and every
    // detection hook stop immediately while quiz generation runs.
    setSessionStatus("generating");
    setSaving(true);
    setSessionError("");
    try {
      const metrics = sessionMetricsRef.current;
      const finalFocusScore = calculateFocusScore({
        totalTime: finalStudyTime,
        focusedTime: metrics.focusedTime,
      });
      await updateStudy(sessionId, {
        status: "completed",
        actualDuration: finalStudyTime,
        pauseDuration: finalPauseDuration,
        pauseCount,
        completed: true,
        focusScore: finalFocusScore,
        ...metrics,
        distractionCount: 0,
        endTime: new Date().toISOString(),
        notes,
      });

      setPauseDuration(finalPauseDuration);
      pauseStartedAt.current = null;
      setSessionStatus("finished");
      // The server generates and persists the quiz when a study is completed.
      // The quiz screen fetches it by this stable study id, so refresh is safe.
      navigate(`/quiz/${sessionId}`);
    } catch (error) {
      setSessionStatus("generation_error");
      setSessionError(
        error.response?.data?.message || "Unable to finish the study session.",
      );
    } finally {
      setSaving(false);
    }
  }, [
    notes,
    pauseCount,
    pauseDuration,
    sessionId,
    sessionStatus,
    currentStudyTime,
  ]);

  const tittle = "AI Study Session";
  if (sessionStatus === "generating") {
    return <DashboardLayout tittle={tittle}><QuizGenerating /></DashboardLayout>;
  }
  return (
    <DashboardLayout tittle={tittle}>
      <div className="min-h-screen bg-slate-950 p-2 sm:p-2 lg:p-1">
        {/* =======================================
                First Row
           ======================================= */}

        <div className="grid lg:grid-cols-3 gap-2 lg:gap-2">
          <div className="lg:col-span-2">
            <StudyForm
              subject={subject}
              topic={topic}
              goal={goal}
              setSubject={setSubject}
              setTopic={setTopic}
              setGoal={setGoal}
              disabled={
                sessionStatus === "running" || sessionStatus === "paused"
              }
            />
          </div>

          <StudyTimer
            status={sessionStatus}
            canStart={canStart}
            loading={saving}
            onStart={startStudy}
            onPause={pauseStudy}
            onFinish={finishStudy}
            studyTime={studyTime}
          />
        </div>

        {sessionError && (
          <p className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {sessionError}
          </p>
        )}

        {/* =======================================
                Second Row
           ======================================= */}

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-2 mt-2 lg:mt-2">
          <div className="lg:col-span-2">
            <CameraPreview
              webcamRef={videoRef}
              faceDetected={faceDetected}
              detections={detections}
              faceCount={faceCount}
              objects={objects}
              active={monitoringActive}
            />
          </div>

          <FaceStatus
            faceDetected={faceDetected}
            phoneDetected={phoneDetected}
            voiceDetected={voiceDetected}
            microphoneStatus={microphoneStatus}
            lookingAway={lookingAway}
            multipleFaces={multipleFaces}
            focusScore={focusScore}
            headPose={headPose}
          />
        </div>

        {/* =======================================
                Third Row
           ======================================= */}

        <div className="mt-2">
          <StudyStats
            pauseCount={pauseCount}
            focusScore={focusScore}
            sessions={sessions}
          />
        </div>

        {/* =======================================
                Fourth Row
           ======================================= */}

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-2 mt-2 lg:mt-2">
          <StudyNotes notes={notes} setNotes={setNotes} />

          <StudyQuote />
        </div>

        {/* =======================================
                Summary Modal
           ======================================= */}

        <StudySummaryModal
          open={showSummary}
          onClose={() => setShowSummary(false)}
          studyTime={studyTime}
          pauseCount={pauseCount}
          focusScore={focusScore}
        />
      </div>
    </DashboardLayout>
  );
}
