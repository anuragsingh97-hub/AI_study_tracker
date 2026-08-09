import { BrainCircuit, LoaderCircle, Sparkles } from "lucide-react";

export default function QuizGenerating() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 text-center shadow-2xl shadow-cyan-950/30 sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
          <BrainCircuit size={40} />
        </div>
        <LoaderCircle className="mx-auto mt-7 animate-spin text-cyan-400" size={30} />
        <h1 className="mt-5 text-2xl font-bold">Generating your quiz</h1>
        <p className="mt-3 leading-6 text-slate-400">Your study session has been saved and AI monitoring is stopped. We’re preparing questions based on your subject and topic.</p>
        <div className="mt-7 flex items-center justify-center gap-2 text-sm text-cyan-200"><Sparkles size={16} /> This can take a moment</div>
      </section>
    </main>
  );
}
