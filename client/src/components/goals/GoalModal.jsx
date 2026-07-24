import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
// import API from "./axios";


const blankGoal = {
  title: "",
  subject: "",
  description: "",
  goalType: "Study Hours",
  target: "",
  deadline: "",
  priority: "Medium",
  difficulty: "Medium",
  notes: "",
  completed: 0,
  milestones: [],
};

export default function GoalModal({ goal, onClose, onSave }) {
  const value = goal ?? blankGoal;
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaveError("");
    setSaving(true);

    try {
      await onSave({
        ...value,
        title: form.get("title").trim(),
        subject: form.get("subject").trim(),
        description: form.get("description").trim(),
        goalType: form.get("goalType"),
        target: Number(form.get("target")),
        deadline: form.get("deadline"),
        priority: form.get("priority"),
        difficulty: form.get("difficulty"),
        notes: form.get("notes").trim(),
      });
    } catch (error) {
      setSaveError(error.response?.data?.message ?? "Could not save this goal. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const Field = ({ label, children }) => (
    <label className="block text-sm text-slate-300">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
  const input =
    "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-blue-500";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
      >
        <motion.form
          initial={{ scale: 0.96, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 16 }}
          onSubmit={submit}
          className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {goal ? "Edit Goal" : "Add Goal"}
              </h2>
              <p className="text-sm text-slate-400">
                Set a clear outcome and deadline.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Goal Title" name="title">
              <input
                required
                name="title"
                defaultValue={value.title}
                className={input}
              />
            </Field>
            <Field label="Subject">
              <input
                required
                name="subject"
                defaultValue={value.subject}
                className={input}
              />
            </Field>
            <Field label="Goal Type">
              <select
                name="goalType"
                defaultValue={value.goalType}
                className={input}
              >
                {[
                  "Study Hours",
                  "LeetCode Problems",
                  "Chapters",
                  "Mock Tests",
                  "Custom",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Target Value">
              <input
                required
                min="1"
                type="number"
                name="target"
                defaultValue={value.target || ""}
                className={input}
              />
            </Field>
            <Field label="Deadline">
              <input
                required
                type="date"
                name="deadline"
                defaultValue={value.deadline}
                className={input}
              />
            </Field>
            <Field label="Priority">
              <select
                name="priority"
                defaultValue={value.priority}
                className={input}
              >
                {["High", "Medium", "Low"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty">
              <select
                name="difficulty"
                defaultValue={value.difficulty}
                className={input}
              >
                {["Easy", "Medium", "Hard"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              required
              name="description"
              defaultValue={value.description}
              rows="3"
              className={`${input} mt-1.5 resize-none`}
            />
          </Field>
          <Field label="Notes">
            <textarea
              name="notes"
              defaultValue={value.notes}
              rows="3"
              className={`${input} mt-1.5 resize-none`}
            />
          </Field>
          {saveError && (
            <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {saveError}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : goal ? "Save Changes" : "Create Goal"}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}
