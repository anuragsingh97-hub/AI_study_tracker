const sessions = [
  {
    subject: "React",
    duration: "2h",
    date: "Today",
  },
  {
    subject: "DBMS",
    duration: "1h 20m",
    date: "Yesterday",
  },
  {
    subject: "DSA",
    duration: "3h",
    date: "Monday",
  },
];

export default function RecentSessions() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800" style={{marginTop:"2px"}}>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white" style={{marginLeft:"15px",marginTop:"3px"}}>
          Recent Sessions
        </h2>

        <button className="text-sm text-blue-400 hover:text-blue-300 transition" style={{marginRight:"10px"}}>
          View All
        </button>
      </div>

      <div className="space-y-4">

        {sessions.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-slate-800/70 border border-slate-700 rounded-2xl px-5 py-4 hover:bg-slate-800 transition" style={{margin:"3px"}}
          >

            {/* Left */}
            <div className="flex items-center gap-4">

              <div className="h-12 w-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                {item.subject[0]}
              </div>

              <div>
                <h3 className="text-white font-semibold">
                  {item.subject}
                </h3>

                <p className="text-sm text-slate-400">
                  {item.date}
                </p>
              </div>

            </div>

            {/* Right */}
            <div className="text-right">

              <p className="text-blue-400 font-semibold" style={{marginRight:"10px"}}>
                {item.duration}
              </p>

              <p className="text-xs text-slate-500" style={{marginRight:"10px"}}>
                Study Time
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}