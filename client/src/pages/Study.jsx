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

  const startStudy = useCallback(() => {
    if (canStart) setSessionStatus("running");
  }, [canStart]);

  const pauseStudy = useCallback(() => {
    if (sessionStatus === "running") {
      setPauseCount((count) => count + 1);
      setSessionStatus("paused");
    }
  }, [sessionStatus]);

  const finishStudy = useCallback(() => {
    if (sessionStatus === "idle" || sessionStatus === "finished") return;
    setSessionStatus("finished");
    setShowSummary(true);
  }, [sessionStatus]);

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
            onStart={startStudy}
            onPause={pauseStudy}
            onFinish={finishStudy}
            setStudyTime={setStudyTime}
          />
        </div>

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
