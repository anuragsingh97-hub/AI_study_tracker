import * as ort from "onnxruntime-web";

let session = null;

export async function loadYOLO() {
  if (session) return session;

  console.log("Loading YOLO...");

  session = await ort.InferenceSession.create(
    "/models/yolo11n.onnx",
    {
      executionProviders: ["wasm"],
    }
  );

  console.log("YOLO Loaded Successfully");

  return session;
}