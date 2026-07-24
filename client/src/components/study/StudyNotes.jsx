import { motion } from "framer-motion";
import { NotebookPen, Save, Trash2 } from "lucide-react";

export default function StudyNotes({ notes, setNotes }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-xl"
      style={{ padding: "10px", margin: "3px" }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <NotebookPen className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Study Notes</h2>
        </div>
        <span className="text-slate-400 text-sm">{notes.length}/1000</span>
      </div>

      <textarea
        rows={8}
        value={notes}
        maxLength={1000}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Write important concepts, formulas, and ideas..."
        className="mt-5 w-full resize-none rounded-2xl bg-slate-800 border border-slate-700 p-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      <div className="flex gap-4 mt-5">
        <button
          type="button"
          className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl py-3 text-white"
        >
          <Save size={18} />
          Save
        </button>
        <button
          type="button"
          onClick={() => setNotes("")}
          aria-label="Clear notes"
          className="bg-red-600 hover:bg-red-700 rounded-xl px-5 text-white"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
