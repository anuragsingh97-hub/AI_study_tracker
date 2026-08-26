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
    <div
      className="flex justify-between items-center bg-slate-800 rounded-xl p-3"
      
    >
      <div className="flex items-center gap-2 text-slate-300">
        {icon}
        {title}
      </div>

      <span
        className={`font-semibold ${ok ? "text-green-400" : "text-red-400"}`}
      >
        {ok ? "Yes" : "No"}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ x: 20 }}
      animate={{ x: 0 }}
      className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400"><BrainCircuit size={20} /></div>
        <div><h2 className="font-bold text-white">Focus insights</h2><p className="text-xs text-slate-400">Live distraction checks</p></div>
      </div>

      <div className="mb-5 flex justify-center">
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full border text-3xl font-bold
          ${
            focusScore >= 80
              ? "border-green-400/30 bg-green-500/20 text-green-400"
              : focusScore >= 50
                ? "border-yellow-400/30 bg-yellow-500/20 text-yellow-400"
                : "border-red-400/30 bg-red-500/20 text-red-400"
          }`}
        >
          {focusScore}%
        </div>
      </div>

      

      <div className="space-y-2">
        <Item title="Face" icon={<ShieldCheck size={18} />} ok={faceDetected} />

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
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        

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
