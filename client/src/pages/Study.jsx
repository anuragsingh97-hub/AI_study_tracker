import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";

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
      if (
        faceVisible &&
        !phoneDetected &&
        !voiceDetected &&
        !lookingAway &&
        !multipleFaces
      ) {
        metrics.focusedTime += 1;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    sessionStatus,
    faceVisible,
    lookingAway,
    multipleFaces,
    phoneDetected,
    voiceDetected,
  ]);

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
    if (
      ["idle", "finished", "generating"].includes(sessionStatus) ||
      !sessionId
    )
      return;

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
    return (
      <DashboardLayout tittle={tittle}>
        <QuizGenerating />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout tittle={tittle}>
      <div className="min-h-full space-y-4 bg-slate-950 p-3 sm:p-5 lg:p-2">
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900 px-5 py-6 sm:px-8">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
                <Sparkles size={14} />
                SMART STUDY WORKSPACE
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Make this session count.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Set a clear intention, stay in flow, and let your AI focus
                companion keep you accountable.
              </p>
            </div>
            <div
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${monitoringActive ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-slate-700 bg-slate-950/50 text-slate-400"}`}
            >
              <ShieldCheck size={18} />
              {monitoringActive
                ? "Focus monitoring active"
                : "Ready when you are"}
            </div>
          </div>
        </section>

        <div className="grid gap-3 xl:grid-cols-4">
          <div className="xl:col-span-3">
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

        <div className="grid gap-4 xl:grid-cols-4">
          <div className="xl:col-span-3">
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

        <StudyStats
          studyTime={studyTime}
          pauseCount={pauseCount}
          focusScore={focusScore}
          sessions={sessions}
        />

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <StudyNotes notes={notes} setNotes={setNotes} />
          </div>
          <div className="lg:col-span-2">
            <StudyQuote />
          </div>
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
