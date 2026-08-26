import { motion } from "framer-motion";
import { NotebookPen, Check, Trash2 } from "lucide-react";
import { useState } from "react";

export default function StudyNotes({ notes, setNotes }) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400"><NotebookPen size={20} /></div>
          <div><h2 className="font-bold text-white">Session notes</h2><p className="text-xs text-slate-400">Capture insights as you learn</p></div>
        </div>
        <span className="text-slate-400 text-sm">{notes.length}/1000</span>
      </div>

      <textarea
        rows={8}
        value={notes}
        maxLength={1000}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Write important concepts, formulas, and ideas..."
        className="mt-5 min-h-40 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950/50 p-4 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Check size={18} />
          {saved ? "Saved for this session" : "Save note"}
        </button>
        <button
          type="button"
          onClick={() => setNotes("")}
          aria-label="Clear notes"
          className="rounded-xl border border-slate-700 bg-slate-800 px-5 text-slate-300 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
