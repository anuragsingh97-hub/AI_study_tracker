import { useEffect, useRef, useState } from "react";
import { loadFaceDetector } from "../ai/face/faceDetector";

export default function useFaceDetection(webcamRef, enabled) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [detections, setDetections] = useState([]);
  const lastFaceSeenAt = useRef(0);

  useEffect(() => {
    let interval;
    let cancelled = false;

    if (!enabled) {
      setFaceDetected(false);
      setFaceCount(0);
      setDetections([]);
      return undefined;
    }

    async function startDetection() {
      const detector = await loadFaceDetector();
      if (cancelled) return;

      interval = setInterval(() => {
        const video = webcamRef.current?.video;

        if (!video) return;

        if (video.readyState !== 4) return;

        const result = detector.detectForVideo(video, performance.now());

        const faces = result.detections ?? [];

        if (faces.length > 0) {
          lastFaceSeenAt.current = Date.now();
          setDetections(faces);
          setFaceDetected(true);
          setFaceCount(faces.length);
          return;
        }

        // Keep the last face state briefly to avoid UI flicker from one
        // dropped camera frame.
        if (Date.now() - lastFaceSeenAt.current > 750) {
          setDetections([]);
          setFaceDetected(false);
          setFaceCount(0);
        }
      }, 100); // 10 FPS
    }

    startDetection();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [webcamRef, enabled]);
  return {
    faceDetected,
    faceCount,
    detections,
  };
}
