import { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import GoalCard from "../components/goals/GoalCard";
import GoalFilters from "../components/goals/GoalFilters";
import GoalHeader from "../components/goals/GoalHeader";
import GoalInsights from "../components/goals/GoalInsights";
import GoalModal from "../components/goals/GoalModal";
import GoalStats from "../components/goals/GoalStats";

import { getGoals, createGoal, updateGoal, deleteGoal } from "../api/goalApi";

const dateFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
const normaliseGoal = (goal) => ({
  ...goal,
  deadline: goal.deadline
    ? new Date(goal.deadline).toISOString().slice(0, 10)
    : "",
  milestones: goal.milestones ?? [],
});
// const seedGoals = [
//   {
//     id: "goal-1",
//     title: "Master React fundamentals",
//     subject: "React",
//     description:
//       "Build a strong understanding of JSX, components, hooks, and state management.",
//     goalType: "Chapters",
//     target: 8,
//     completed: 5,
//     priority: "High",
//     difficulty: "Medium",
//     deadline: dateFromToday(12),
//     notes: "Use the official React documentation and create one mini project.",
//     createdAt: Date.now() - 86400000 * 3,
//     milestones: [
//       { id: "m1", title: "Learn JSX", completed: true },
//       { id: "m2", title: "Build components", completed: true },
//       { id: "m3", title: "Practice Hooks", completed: false },
//     ],
//   },
//   {
//     id: "goal-2",
//     title: "Solve DSA patterns",
//     subject: "Data Structures",
//     description:
//       "Practice core array, stack, queue, and sliding-window patterns.",
//     goalType: "LeetCode Problems",
//     target: 50,
//     completed: 19,
//     priority: "High",
//     difficulty: "Hard",
//     deadline: dateFromToday(7),
//     notes: "Review wrong solutions every Sunday.",
//     createdAt: Date.now() - 86400000 * 9,
//     milestones: [
//       { id: "m4", title: "Arrays", completed: true },
//       { id: "m5", title: "Sliding window", completed: false },
//     ],
//   },
//   {
//     id: "goal-3",
//     title: "Complete DBMS revision",
//     subject: "DBMS",
//     description:
//       "Revise normalisation, transactions, indexing, and SQL queries.",
//     goalType: "Study Hours",
//     target: 12,
//     completed: 12,
//     priority: "Medium",
//     difficulty: "Medium",
//     deadline: dateFromToday(2),
//     notes: "Create a one-page SQL cheat sheet.",
//     createdAt: Date.now() - 86400000 * 20,
//     milestones: [
//       { id: "m6", title: "Transactions", completed: true },
//       { id: "m7", title: "Indexing", completed: true },
//     ],
//   },
//   {
//     id: "goal-4",
//     title: "Operating systems notes",
//     subject: "Operating System",
//     description: "Prepare concise notes for process scheduling and deadlocks.",
//     goalType: "Chapters",
//     target: 6,
//     completed: 1,
//     priority: "Low",
//     difficulty: "Easy",
//     deadline: dateFromToday(-3),
//     notes: "Restart this after the DSA mock test.",
//     createdAt: Date.now() - 86400000 * 30,
//     milestones: [
//       { id: "m8", title: "Scheduling", completed: true },
//       { id: "m9", title: "Deadlocks", completed: false },
//     ],
//   },
// ];

const progressOf = (goal) =>
  Math.min(100, Math.round((goal.completed / goal.target) * 100));
const statusOf = (goal) => {
  if (progressOf(goal) >= 100) return "Completed";
  if (new Date(`${goal.deadline}T23:59:59`) < new Date()) return "Expired";
  if (goal.completed > 0) return "In Progress";
  return "Pending";
};
const countdownOf = (deadline) => {
  const days = Math.ceil(
    (new Date(`${deadline}T23:59:59`) - new Date()) / 86400000,
  );
  return days < 0
    ? `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`
    : days === 0
      ? "Due today"
      : `${days} day${days === 1 ? "" : "s"} left`;
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Deadline");
  const [editingGoal, setEditingGoal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await getGoals();
      setGoals(res.data.goals.map(normaliseGoal));
    } catch (err) {
      console.error("Could not save goal", err.response?.data?.message ?? err);
      throw err;
    }
  };

  const stats = useMemo(
    () => [
      { title: "Total Goals", value: goals.length },
      {
        title: "Completed",
        value: goals.filter((goal) => statusOf(goal) === "Completed").length,
      },
      {
        title: "In Progress",
        value: goals.filter((goal) => statusOf(goal) === "In Progress").length,
      },
      {
        title: "Overdue",
        value: goals.filter((goal) => statusOf(goal) === "Expired").length,
      },
    ],
    [goals],
  );

  const shownGoals = useMemo(
    () =>
      goals
        .filter((goal) =>
          `${goal.title} ${goal.subject}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .filter(
          (goal) =>
            filter === "All" ||
            (filter === "High Priority"
              ? goal.priority === "High"
              : statusOf(goal) === filter),
        )
        .sort((first, second) =>
          sort === "Progress"
            ? progressOf(second) - progressOf(first)
            : sort === "Priority"
              ? { High: 3, Medium: 2, Low: 1 }[second.priority] -
                { High: 3, Medium: 2, Low: 1 }[first.priority]
              : sort === "Recently Added"
                ? second.createdAt - first.createdAt
                : new Date(first.deadline) - new Date(second.deadline),
        ),
    [filter, goals, query, sort],
  );
  const saveGoal = async (goal) => {
    try {
      if (goal._id) {
        await updateGoal(goal._id, goal);
      } else {
        await createGoal(goal);
      }

      await fetchGoals();

      setModalOpen(false);
      setEditingGoal(null);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log("goal::",goals);
  const persistGoal = async (nextGoal) => {
    
    try {
      const { data } = await updateGoal(nextGoal._id, nextGoal);
      setGoals((items) =>
        items.map((item) =>
          item._id === data.goal._id ? normaliseGoal(data.goal) : item,
        ),
      );
    } catch (error) {
      console.error("Could not save goal changes", error);
      await fetchGoals();
    }
  };
  const toggleMilestone = (goalId, milestoneId) => {
    const goal = goals.find((item) => item._id === goalId);
    if (!goal) return;
    const milestones = goal.milestones.map((milestone) =>
      milestone._id === milestoneId
        ? { ...milestone, completed: !milestone.completed }
        : milestone,
    );
    const completed = milestones.length
      ? Math.round(
          (milestones.filter((milestone) => milestone.completed).length /
            milestones.length) *
            goal.target,
        )
      : goal.completed;
    persistGoal({ ...goal, milestones, completed });
  };
  const addMilestone = (goalId, title) => {
    const goal = goals.find((item) => item._id === goalId);
    console.log("mil goal----",goal);
    if (goal)
      persistGoal({
        ...goal,
        milestones: [...goal.milestones, { title, completed: false }],
      });
  };
  const confirmDelete = async () => {
    try {
      await deleteGoal(deletingGoal._id);
      setGoals((items) =>
        items.filter((goal) => goal._id !== deletingGoal._id),
      );
      setDeletingGoal(null);
    } catch (error) {
      console.error("Could not delete goal", error);
    }
  };
  return (
    <DashboardLayout tittle="My Goals">
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <GoalHeader
            onAdd={() => {
              setEditingGoal(null);
              setModalOpen(true);
            }}
          />
          <GoalStats stats={stats} />
          <GoalFilters
            {...{ query, setQuery, filter, setFilter, sort, setSort }}
          />
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Your learning goals
              </h2>
              <p className="text-sm text-slate-400">
                {shownGoals.length} shown
              </p>
            </div>
            {shownGoals.length ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {shownGoals.map((goal) => (
                  <GoalCard
                    key={goal._id}
                    goal={goal}
                    status={statusOf(goal)}
                    countdown={countdownOf(goal.deadline)}
                    onEdit={(item) => {
                      setEditingGoal(item);
                      setModalOpen(true);
                    }}
                    onDelete={setDeletingGoal}
                    onMilestone={toggleMilestone}
                    onAddMilestone={addMilestone}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
                No goals match your search. Try another filter or add a goal.
              </div>
            )}
          </section>
          <GoalInsights />
        </div>
      </main>
      {modalOpen && (
        <GoalModal
          goal={editingGoal}
          onClose={() => {
            setModalOpen(false);
            setEditingGoal(null);
          }}
          onSave={saveGoal}
        />
      )}
      {deletingGoal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Delete this goal?</h2>
            <p className="mt-2 text-sm text-slate-400">
              This removes “{deletingGoal.title}” and its milestones.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingGoal(null)}
                className="rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
