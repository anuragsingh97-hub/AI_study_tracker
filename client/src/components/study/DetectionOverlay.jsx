export default function DetectionOverlay({
  detections,
  videoWidth,
  videoHeight,
}) {
  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${videoWidth} ${videoHeight}`}
    >
      {detections.map((face, index) => {
        const box = face.boundingBox;

        return (
          <rect
            key={index}
            x={box.originX}
            y={box.originY}
            width={box.width}
            height={box.height}
            fill="none"
            stroke="#00ff00"
            strokeWidth="3"
          />
        );
      })}
    </svg>
  );
}