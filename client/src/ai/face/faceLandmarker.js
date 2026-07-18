import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker = null;

export async function loadFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },

    runningMode: "VIDEO",

    numFaces: 5,

    outputFaceBlendshapes: true,

    outputFacialTransformationMatrixes: true,
  });

  return faceLandmarker;
}