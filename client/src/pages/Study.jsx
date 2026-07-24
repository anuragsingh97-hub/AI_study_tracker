import { useState, useRef, useMemo, useCallback } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import StudyForm from "../components/study/StudyForm";
import StudyTimer from "../components/study/StudyTimer";
import CameraPreview from "../components/study/CameraPreview";
import FaceStatus from "../components/study/FaceStatus";
import StudyStats from "../components/study/StudyStats";
import StudyNotes from "../components/study/StudyNotes";
import StudyQuote from "../components/study/StudyQuote";
import StudySummaryModal from "../components/study/StudySummaryModal";
import useFaceDetection from "../hooks/useFaceDetection";
import useFaceLandmarker from "../hooks/useFaceLandmarker";
import useYOLODetection from "../hooks/useYOLODetection";
import useVoiceDetection from "../hooks/useVoiceDetection";
import { createStudy, updateStudy } from "../api/studyApi";

export default function StudyPage() {
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
  const { objects, phoneDetected } = useYOLODetection(videoRef, monitoringActive);
  const { voiceDetected, microphoneStatus } = useVoiceDetection(monitoringActive);
  const { faceDetected, faceCount, detections } = useFaceDetection(videoRef, monitoringActive);
  const { headPose } = useFaceLandmarker(videoRef, monitoringActive);

  const faceVisible = faceDetected && headPose.direction !== "No Face";
  const lookingAway = !faceVisible || headPose.lookingAway;
  // Face detection is more reliable than a general object detector for
  // deciding whether another person is present in a webcam view.
  const multipleFaces = faceCount > 1;

  // -------------------------------
  // Statistics
  // -------------------------------

  const [studyTime, setStudyTime] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [sessions] = useState(15);
  const canStart = Boolean(subject.trim() && topic.trim() && goal.trim());

  // -------------------------------
  // Focus Score
  // -------------------------------

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
      const resumedPauseDuration = pauseDuration + Math.floor((Date.now() - pauseStartedAt.current) / 1000);

      setSaving(true);
      setSessionError("");
      try {
        await updateStudy(sessionId, {
          status: "active",
          pauseDuration: resumedPauseDuration,
        });
        setPauseDuration(resumedPauseDuration);
        pauseStartedAt.current = null;
        setSessionStatus("running");
      } catch (error) {
        setSessionError(error.response?.data?.message || "Unable to resume the study session.");
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
      setPauseCount(0);
      setPauseDuration(0);
      setSessionStatus("running");
    } catch (error) {
      setSessionError(error.response?.data?.message || "Unable to start the study session.");
    } finally {
      setSaving(false);
    }
  }, [canStart, pauseDuration, sessionId, sessionStatus, subject, topic]);

  const pauseStudy = useCallback(async () => {
    if (sessionStatus !== "running" || !sessionId) return;

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
      setSessionStatus("running");
      setSessionError(error.response?.data?.message || "Unable to pause the study session.");
    } finally {
      setSaving(false);
    }
  }, [pauseCount, pauseDuration, sessionId, sessionStatus]);

  const finishStudy = useCallback(async () => {
    if (["idle", "finished"].includes(sessionStatus) || !sessionId) return;

    const finalPauseDuration = pauseStartedAt.current
      ? pauseDuration + Math.floor((Date.now() - pauseStartedAt.current) / 1000)
      : pauseDuration;

    setSaving(true);
    setSessionError("");
    try {
      await updateStudy(sessionId, {
        status: "completed",
        actualDuration: studyTime,
        pauseDuration: finalPauseDuration,
        pauseCount,
        completed: true,
        focusScore,
        distractionCount: 0,
        endTime: new Date().toISOString(),
        notes,
      });
      
      setPauseDuration(finalPauseDuration);
      pauseStartedAt.current = null;
      setSessionStatus("finished");
      setShowSummary(true);
    } catch (error) {
      setSessionError(error.response?.data?.message || "Unable to finish the study session.");
    } finally {
      setSaving(false);
    }
  }, [focusScore, notes, pauseCount, pauseDuration, sessionId, sessionStatus, studyTime]);

  const tittle = "AI Study Session";
  return (
    <DashboardLayout tittle={tittle}>
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        {/* =======================================
                First Row
           ======================================= */}

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-8">
          <div className="lg:col-span-2">
            <StudyForm
              subject={subject}
              topic={topic}
              goal={goal}
              setSubject={setSubject}
              setTopic={setTopic}
              setGoal={setGoal}
              disabled={sessionStatus === "running" || sessionStatus === "paused"}
            />
          </div>

          <StudyTimer
            status={sessionStatus}
            canStart={canStart}
            loading={saving}
            onStart={startStudy}
            onPause={pauseStudy}
            onFinish={finishStudy}
            setStudyTime={setStudyTime}
            seconds={studyTime}
          />
        </div>

        {sessionError && (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {sessionError}
          </p>
        )}

        {/* =======================================
                Second Row
           ======================================= */}

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-8 mt-5 lg:mt-8">
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

        <div className="mt-8">
          <StudyStats
            studyTime={studyTime}
            pauseCount={pauseCount}
            focusScore={focusScore}
            sessions={sessions}
          />
        </div>

        {/* =======================================
                Fourth Row
           ======================================= */}

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-8 mt-5 lg:mt-8">
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
