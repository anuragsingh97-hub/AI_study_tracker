import { useEffect, useRef, useState } from "react";
import { loadYOLO } from "../ai/yolo/yoloDetector";
import { detectObjects } from "../ai/yolo/detectObjects";

export default function useYOLODetection(videoRef, enabled) {
  const [objects, setObjects] = useState([]);
  const [phoneDetected, setPhoneDetected] = useState(false);
  const [personCount, setPersonCount] = useState(0);
  const phoneHits = useRef(0);
  const lastPhoneSeenAt = useRef(0);

  useEffect(() => {
    let interval;
    let cancelled = false;
    let inferenceInProgress = false;

    if (!enabled) {
      phoneHits.current = 0;
      lastPhoneSeenAt.current = 0;
      setObjects([]);
      setPhoneDetected(false);
      setPersonCount(0);
      return undefined;
    }

    async function start() {
      let session;
      try {
        session = await loadYOLO();
      } catch (error) {
        console.error("Unable to load YOLO model:", error);
        return;
      }

      interval = setInterval(async () => {
        if (cancelled || inferenceInProgress) return;

        const video = videoRef.current?.video;
        if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

        inferenceInProgress = true;
        try {
          const detectedObjects = await detectObjects(session, video);
          if (cancelled) return;

          setObjects(detectedObjects);
          const phoneInFrame = detectedObjects.some((object) => object.class === "cell phone");

          if (phoneInFrame) {
            phoneHits.current += 1;
            lastPhoneSeenAt.current = Date.now();
          } else {
            phoneHits.current = 0;
          }

          // Require two matching frames to prevent a random object from being
          // shown as a phone, then retain it briefly if a camera frame drops.
          setPhoneDetected(
            phoneHits.current >= 2 || Date.now() - lastPhoneSeenAt.current < 1200,
          );
          setPersonCount(detectedObjects.filter((object) => object.class === "person").length);
        } catch (error) {
          console.error("YOLO inference failed:", error);
        } finally {
          inferenceInProgress = false;
        }
      }, 500);
    }

    start();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [videoRef, enabled]);

  return { objects, phoneDetected, personCount };
}
