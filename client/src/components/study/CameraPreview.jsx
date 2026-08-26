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
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400"><Camera size={20} /></div>

          <div>
            <h2 className="font-semibold text-white">Focus monitor</h2>

            <p className="text-xs text-slate-400">
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
            className="h-[380px] w-full object-cover sm:h-[550px]"
          />
        ) : (
          <div className="flex h-[380px] items-center justify-center bg-slate-950 px-6 text-center sm:h-[550px]">
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
