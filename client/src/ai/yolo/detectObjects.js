import * as ort from "onnxruntime-web";
import { COCO_CLASSES } from "./cocoClasses";

const SIZE = 640;
const CONFIDENCE_THRESHOLD = 0.3;
const IOU_THRESHOLD = 0.45;

function intersectionOverUnion(first, second) {
  const left = Math.max(first.x, second.x);
  const top = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
  const union = first.width * first.height + second.width * second.height - intersection;

  return union ? intersection / union : 0;
}

function nonMaximumSuppression(candidates) {
  const selected = [];

  for (const candidate of [...candidates].sort((a, b) => b.confidence - a.confidence)) {
    const overlapsExisting = selected.some(
      (existing) =>
        existing.class === candidate.class &&
        intersectionOverUnion(existing.box, candidate.box) > IOU_THRESHOLD,
    );

    if (!overlapsExisting) selected.push(candidate);
  }

  return selected;
}

export async function detectObjects(session, video) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, SIZE, SIZE);
  const imageData = context.getImageData(0, 0, SIZE, SIZE);
  const input = new Float32Array(3 * SIZE * SIZE);

  for (let index = 0; index < SIZE * SIZE; index++) {
    input[index] = imageData.data[index * 4] / 255;
    input[index + SIZE * SIZE] = imageData.data[index * 4 + 1] / 255;
    input[index + 2 * SIZE * SIZE] = imageData.data[index * 4 + 2] / 255;
  }

  const tensor = new ort.Tensor("float32", input, [1, 3, SIZE, SIZE]);
  const results = await session.run({ images: tensor });
  const output = results.output0 ?? Object.values(results)[0];
  const [, attributes, predictions] = output.dims;

  // YOLO11 COCO export: [1, 84, 8400] = box x/y/w/h plus 80 class scores.
  if (attributes !== COCO_CLASSES.length + 4) {
    throw new Error(`Unexpected YOLO output shape: ${output.dims.join(" x ")}`);
  }

  const candidates = [];
  for (let prediction = 0; prediction < predictions; prediction++) {
    let classIndex = -1;
    let confidence = 0;

    for (let index = 0; index < COCO_CLASSES.length; index++) {
      const score = output.data[(index + 4) * predictions + prediction];
      if (score > confidence) {
        confidence = score;
        classIndex = index;
      }
    }

    if (confidence < CONFIDENCE_THRESHOLD) continue;

    const width = output.data[2 * predictions + prediction];
    const height = output.data[3 * predictions + prediction];
    candidates.push({
      class: COCO_CLASSES[classIndex],
      confidence,
      box: {
        x: output.data[prediction] - width / 2,
        y: output.data[predictions + prediction] - height / 2,
        width,
        height,
      },
    });
  }

  return nonMaximumSuppression(candidates);
}
