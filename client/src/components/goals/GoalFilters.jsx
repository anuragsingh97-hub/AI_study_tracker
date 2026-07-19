import { Search, SlidersHorizontal } from "lucide-react";

export default function GoalFilters({
  query,
  setQuery,
  filter,
  setFilter,
  sort,
  setSort,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-4 lg:flex-row lg:items-center">
      <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-slate-400">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search goals or subjects..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </label>
      <div className="flex items-center gap-2 text-slate-400">
        <SlidersHorizontal size={18} />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        >
          <option>All</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Expired</option>
          <option>High Priority</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        >
          <option>Deadline</option>
          <option>Progress</option>
          <option>Priority</option>
          <option>Recently Added</option>
        </select>
      </div>
    </div>
  );
}
