import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  ChartNoAxesCombined,
  Goal,
  Lightbulb,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import useAuth from "../hooks/useAuth";
import AISummary from "../components/ai/AISummary";
import TypingIndicator from "../components/ai/TypingIndicator";

const suggestions = [
  "Create today's timetable",
  "Explain Binary Search",
  "Analyze my study progress",
  "Generate my weekly report",
  "Recommend my next goal",
  "Help me improve focus",
];
const actions = [
  [
    "Generate study plan",
    "Create a focused study plan for today.",
    BrainCircuit,
  ],
  [
    "Analyze progress",
    "Analyze my study progress and suggest improvements.",
    ChartNoAxesCombined,
  ],
  [
    "Explain a topic",
    "Explain Binary Search with a simple example.",
    Lightbulb,
  ],
  ["Daily report", "Create a concise daily study report.", Target],
];
const time = () =>
  new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(
    new Date(),
  );

function assistantReply(prompt) {
  const subject = /binary search/i.test(prompt)
    ? "Binary Search"
    : /focus/i.test(prompt)
      ? "focus"
      : /goal/i.test(prompt)
        ? "your goals"
        : "your study plan";
  return `Great question! Here is a focused next step for **${subject}**:\n\n1. Start with one 45-minute distraction-free session.\n2. Write down the one outcome you want to achieve.\n3. Take a 10-minute break, then review what felt difficult.\n\nYour recent focus score is strong—keep the phone away and study between **8 PM and 10 PM** for your best results.`;
}

function ChatMessage({ message }) {
  const isUser = message.role === "user";
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
          <Bot size={19} />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${isUser ? "rounded-tr-sm bg-blue-600 text-white" : "rounded-tl-sm border border-slate-700 bg-slate-800 text-slate-200"}`}
      >
        {message.text.split("\n").map((line, index) => (
          <p key={`${line}-${index}`} className={line ? "" : "h-3"}>
            {line.replaceAll("**", "")}
          </p>
        ))}
        <p
          className={`mt-2 text-[11px] ${isUser ? "text-blue-100" : "text-slate-500"}`}
        >
          {message.time}
        </p>
      </div>
    </motion.article>
  );
}

function Insight({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="text-slate-200">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      time: time(),
      text: `Hello ${user?.name || "there"} 👋\n\nI'm your AI Study Assistant. I can help with DSA, study plans, goal tracking, productivity, and career guidance. What would you like to work on?`,
    },
  ]);
  const endRef = useRef(null);
  useEffect(() => {
    // scrollIntoView may return a Promise in modern browsers; effects may only
    // return a cleanup function, so deliberately do not return that result.
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);
  const send = (prompt = input) => {
    const text = prompt.trim();
    if (!text || typing) return;
    setMessages((current) => [
      ...current,
      { role: "user", text, time: time() },
    ]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: assistantReply(text), time: time() },
      ]);
      setTyping(false);
    }, 700);
  };
  return (
    <DashboardLayout tittle="AI Assistant">
      <div className="space-y-6 pb-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/15 via-slate-900 to-violet-600/15 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30">
              <Sparkles />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                AI Study Assistant
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Your personal AI mentor for smarter learning.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:self-auto">
            <i className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            AI online ·{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </header>
        {/* <AISummary /> */}
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 xl:col-span-2">
            <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
              <div className="rounded-xl bg-blue-500/15 p-2 text-blue-300">
                <Bot size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-white">Study coach</h2>
                <p className="text-xs text-slate-400">
                  Ask about studying, code, goals, or productivity
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {messages.map((message, i) => (
                <ChatMessage key={`${message.time}-${i}`} message={message} />
              ))}
              {typing && <TypingIndicator />}
              <div ref={endRef} />
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
              className="border-t border-slate-800 p-4"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-800 p-2 focus-within:border-blue-500">
                <button
                  type="button"
                  aria-label="Attach file"
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  <Paperclip size={18} />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows="1"
                  placeholder="Ask anything..."
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  aria-label="Voice input"
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  <Mic size={18} />
                </button>
                <button
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="rounded-xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 px-2 text-[11px] text-slate-500">
                Enter to send · Shift + Enter for a new line
              </p>
            </form>
          </section>
          <aside className="space-y-5">
            <section className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-violet-600/10 p-5">
              <div className="flex items-center gap-2 text-blue-200">
                <Target size={18} />
                <h2 className="font-semibold">Today&apos;s recommendation</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                You study best between{" "}
                <b className="text-white">8 PM and 10 PM</b>. Solve 3 Medium
                LeetCode problems, then revise Graph Algorithms before sleeping.
              </p>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-semibold text-white">Quick actions</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {actions.map(([name, prompt, Icon]) => (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => send(prompt)}
                    key={name}
                    className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-left text-xs text-slate-300 transition hover:border-blue-500/50 hover:bg-blue-500/10"
                  >
                    <Icon size={17} className="mb-2 text-blue-300" />
                    {name}
                  </motion.button>
                ))}
              </div>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-semibold text-white">Suggested questions</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    onClick={() => send(suggestion)}
                    key={suggestion}
                    className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-left text-xs text-slate-400 transition hover:border-blue-500 hover:text-blue-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </section>
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-semibold text-white">Session insights</h2>
              <div className="mt-4 space-y-3">
                <Insight
                  label="Focus score"
                  value={89}
                  color="bg-emerald-500"
                />
                <Insight
                  label="Face visibility"
                  value={96}
                  color="bg-blue-500"
                />
                <Insight
                  label="Low distractions"
                  value={91}
                  color="bg-violet-500"
                />
                <Insight
                  label="Phone-free time"
                  value={96}
                  color="bg-cyan-500"
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
