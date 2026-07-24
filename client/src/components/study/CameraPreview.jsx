import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { Camera, ScanFace, Circle, Maximize2 } from "lucide-react";
import DetectionOverlay from "./DetectionOverlay";

export default function CameraPreview({
  webcamRef,
  faceDetected,
  detections,
  faceCount,
  active,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-xl"
      style={{ padding: "10px", margin: "3px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Camera className="text-blue-400" />

          <div>
            <h2 className="text-white font-semibold text-lg">AI Camera</h2>

            <p className="text-slate-400 text-sm">
              {active ? "Live Monitoring" : "Monitoring paused"}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm
          ${
            active && faceDetected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          <Circle
            size={10}
            fill="currentColor"
            className={active && faceDetected ? "animate-pulse" : ""}
          />

          {active && faceDetected ? "Online" : active ? "Searching" : "Paused"}
        </div>
      </div>

      <div className="relative">
        {active ? (
          <Webcam
            ref={webcamRef}
            mirrored
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
            }}
            className="w-full h-[350px] object-cover"
          />
        ) : (
          <div className="flex h-[350px] items-center justify-center bg-slate-950 px-6 text-center">
            <div>
              <Camera className="mx-auto mb-3 text-slate-500" size={36} />
              <p className="font-medium text-slate-200">Camera is paused</p>
              <p className="mt-1 text-sm text-slate-400">
                Start or resume your study session to enable AI monitoring.
              </p>
            </div>
          </div>
        )}
        {active && (
          <DetectionOverlay
            detections={detections}
            videoWidth={1280}
            videoHeight={720}
          />
        )}
        {active && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-2 rounded-xl flex gap-2">
            <ScanFace className="text-blue-400" size={18} />
            <span className="text-white text-sm">AI Vision</span>
          </div>
        )}
        {active && (
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-2 rounded-xl">
            <p className="text-white text-sm">Faces Detected: {faceCount}</p>
          </div>
        )}
        {active && (
          <button
            type="button"
            aria-label="Expand camera preview"
            className="absolute top-4 right-4 bg-black/60 p-2 rounded-xl"
          >
            <Maximize2 className="text-white" size={18} />
          </button>
        )}

        {active && !faceDetected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-44 h-56 border-4 border-dashed border-white/50 rounded-full" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
