export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
        AI
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-1">
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300 [animation-delay:150ms]" />
          <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300 [animation-delay:300ms]" />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">AI is thinking...</p>
      </div>
    </div>
  );
}
