import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let detector = null;

export async function loadFaceDetector() {
  if (detector) return detector;

  console.log("Loading MediaPipe...");

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  console.log("Vision loaded");

  detector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
    },
    runningMode: "VIDEO",
  });

  console.log("Detector ready");

  return detector;
}