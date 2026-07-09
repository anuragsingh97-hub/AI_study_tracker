import { useEffect, useState } from "react";
import { loadFaceDetector } from "../ai/faceDetector";

export default function useFaceDetection(videoRef) {
  const [faceDetected, setFaceDetected] = useState(false);

  useEffect(() => {
    let detector;

    async function start() {
      detector = await loadFaceDetector();

      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4 &&
          webcamRef.current.video.videoWidth > 0 &&
          webcamRef.current.video.videoHeight > 0
        ) {
          const result = detector.detectForVideo(
            webcamRef.current.video,
            performance.now(),
          );

          setFaceDetected(result.detections.length > 0);
        }

        requestAnimationFrame(detect);
      };

      detect();
    }

    start();
  }, []);

  return faceDetected;
}
