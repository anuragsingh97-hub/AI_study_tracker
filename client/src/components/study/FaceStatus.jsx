import { motion } from "framer-motion";
import {
  BrainCircuit,
  ShieldCheck,
  Smartphone,
  Mic,
  Eye,
  Users,
} from "lucide-react";

export default function FaceStatus({
  faceDetected,
  phoneDetected,
  voiceDetected,
  microphoneStatus,
  lookingAway,
  multipleFaces,
  focusScore,
   headPose,
}) {
  const noFaceVisible = !faceDetected || headPose.direction === "No Face";
  const Item = ({ icon, title, ok }) => (
    <div className="flex justify-between items-center bg-slate-800 rounded-xl p-3" style={{padding:"1px",margin:"3px"}}>
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        {title}
      </div>

      <span
        className={`font-semibold ${
          ok ? "text-green-400" : "text-red-400"
        }`}
      >
        {ok ? "Yes" : "No"}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ x: 20 }}
      animate={{ x: 0 }}
      className="bg-slate-900 rounded-3xl border border-slate-700 p-6 shadow-xl"style={{padding:"10px",margin:"3px"}}
    >
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="text-blue-400" />

        <h2 className="text-white text-xl font-bold">
          AI Status
        </h2>
      </div>

      <div className="flex justify-center mb-6">
        <div
          className={`w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold
          ${
            focusScore >= 80
              ? "bg-green-500/20 text-green-400"
              : focusScore >= 50
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {focusScore}%
        </div>
      </div>

      <p className="text-center text-slate-400 mb-5">
        Focus Score
      </p>

      <div className="space-y-3">
        <Item
          title="Face"
          icon={<ShieldCheck size={18} />}
          ok={faceDetected}
        />

        <Item
          title="Phone Detected"
          icon={<Smartphone size={18} />}
          ok={phoneDetected}
        />

        <Item
          title={microphoneStatus === "ready" ? "Voice Detected" : "Microphone"}
          icon={<Mic size={18} />}
          ok={microphoneStatus === "ready" ? voiceDetected : false}
        />

        {microphoneStatus !== "ready" && (
          <p className="px-1 text-xs text-amber-300">
            {microphoneStatus === "requesting"
              ? "Requesting microphone access…"
              : microphoneStatus === "inactive"
                ? "Microphone starts when the study session starts."
              : microphoneStatus === "blocked"
                ? "Allow microphone access to enable voice detection."
                : "Voice detection is unavailable in this browser."}
          </p>
        )}

        <Item
          title="Looking Screen"
          icon={<Eye size={18} />}
          ok={!noFaceVisible && !lookingAway}
        />

        <Item
          title="Single Person"
          icon={<Users size={18} />}
          ok={!noFaceVisible && !multipleFaces}
        />
      </div>
      <div className="mt-4 rounded-xl bg-slate-800 p-4">
  <h3 className="text-sm text-slate-400 mb-2">
    Head Direction
  </h3>

  <div className="flex items-center justify-between">
    <span className="text-white font-medium">
      {noFaceVisible ? "No Face" : headPose.direction}
    </span>

    <span
      className={`text-sm font-semibold ${
        noFaceVisible || headPose.lookingAway
          ? "text-red-400"
          : "text-green-400"
      }`}
    >
      {noFaceVisible
        ? "Face not visible"
        : headPose.lookingAway
          ? "Looking Away"
          : "Focused"}
    </span>
  </div>
</div>
      
    </motion.div>
  );
}
