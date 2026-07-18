import { useEffect, useState } from "react";
import { loadFaceLandmarker } from "../ai/face/faceLandmarker";
import { calculateHeadPose } from "../ai/face/headPose";

export default function useFaceLandmarker(videoRef, enabled) {
  const [landmarks, setLandmarks] = useState([]);
  const [blendShapes, setBlendShapes] = useState([]);
  const [matrix, setMatrix] = useState(null);
  const [headPose, setHeadPose] = useState({
    direction: "No Face",
    lookingAway: false,
  });

  useEffect(() => {
    let interval;
    let cancelled = false;

    if (!enabled) {
      setLandmarks([]);
      setBlendShapes([]);
      setMatrix(null);
      setHeadPose({ direction: "No Face", lookingAway: false });
      return undefined;
    }

    async function startLandmarker() {
      const detector = await loadFaceLandmarker();
      if (cancelled) return;

      interval = setInterval(() => {
        const video = videoRef.current?.video;

        if (!video || video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) return;

        const result = detector.detectForVideo(video, performance.now());

        setLandmarks(result.faceLandmarks || []);
        setBlendShapes(result.faceBlendshapes || []);
        setMatrix(result.facialTransformationMatrixes || []);
        const pose = calculateHeadPose(result.faceLandmarks || []);
        setHeadPose(pose);
      }, 100);
    }

    startLandmarker();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [videoRef, enabled]);

  return {
    landmarks,
    blendShapes,
    matrix,
    headPose,
  };
}
