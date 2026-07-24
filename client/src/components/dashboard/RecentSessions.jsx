const formatDuration = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m`;
  return `${totalSeconds}s`;
};

const formatDate = (date) => {
  if (!date) return "No date";

  const sessionDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (sessionDate.toDateString() === today.toDateString()) return "Today";
  if (sessionDate.toDateString() === yesterday.toDateString()) return "Yesterday";

  return sessionDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function RecentSessions({ sessions = [], loading = false, error = "" }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800" style={{ marginTop: "2px" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white" style={{ marginLeft: "15px", marginTop: "3px" }}>
          Recent Sessions
        </h2>

        <span className="text-sm text-blue-400" style={{ marginRight: "10px" }}>{sessions.length} total</span>
      </div>

      <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-1">
        {loading && <p className="px-5 py-4 text-sm text-slate-400">Loading sessions...</p>}
        {!loading && error && <p className="px-5 py-4 text-sm text-red-300">{error}</p>}
        {!loading && !error && sessions.length === 0 && <p className="px-5 py-4 text-sm text-slate-400">No study sessions yet.</p>}

        {sessions.map((session) => (
          <div key={session._id} className="flex items-center justify-between bg-slate-800/70 border border-slate-700 rounded-2xl px-5 py-4 hover:bg-slate-800 transition" style={{ margin: "3px" }}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                {(session.subject || "S").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-semibold">{session.subject}</h3>
                <p className="text-sm text-slate-400">{session.topic ? `${session.topic} · ` : ""}{formatDate(session.startTime || session.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-400 font-semibold" style={{ marginRight: "10px" }}>{formatDuration(session.actualDuration)}</p>
              <p className="text-xs text-slate-500" style={{ marginRight: "10px" }}>{session.status === "active" ? "In progress" : "Study Time"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
