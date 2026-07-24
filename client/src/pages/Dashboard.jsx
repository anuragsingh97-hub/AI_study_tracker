import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import StudyChart from "../components/dashboard/StudyChart";
import PomodoroCard from "../components/dashboard/PomodoroCard";
import GoalProgress from "../components/dashboard/GoalProgress";
import RecentSessions from "../components/dashboard/RecentSessions";
import { getStudies } from "../api/studyApi";
import { getGoals } from "../api/goalApi";
// console.log("goalsResponse",getGoals)
const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const endOfDay = (date) => {
  const result = startOfDay(date);
  result.setDate(result.getDate() + 1);
  return result;
};

const startOfWeek = (date) => {
  const result = startOfDay(date);
  const daysSinceMonday = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - daysSinceMonday);
  return result;
};

const formatDuration = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m`;
  return `${totalSeconds}s`;
};

const durationOf = (session, now) => {
  if (session.status !== "active") return Number(session.actualDuration) || 0;

  const elapsed = Math.floor((now - new Date(session.startTime)) / 1000);
  return Math.max(0, elapsed - (Number(session.pauseDuration) || 0));
};

const progressOf = (goals) => {
  if (!goals.length) return 0;
  return Math.round(
    goals.reduce(
      (total, goal) =>
        total + Math.min(100, (goal.completed / goal.target) * 100),
      0,
    ) / goals.length,
  );
};

const tittle = "Dashboard";

const Dashboard = () => {
  const [studies, setStudies] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [studiesResponse, goalsResponse] = await Promise.all([
          getStudies(),
          getGoals(),
        ]);
        if (!mounted) return;

        setStudies(studiesResponse.data.studies || []);
        setGoals(goalsResponse.data.goals || []);
        // console.log("goalsResponse",goalsResponse.data.goals)
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load dashboard data.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    // console.log("goalsResponse",goals)
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const dashboard = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const tomorrowStart = endOfDay(now);
    const weekStart = startOfWeek(now);
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const sessionsToday = studies.filter((study) => {
      const date = new Date(study.startTime || study.createdAt);
      return date >= todayStart && date < tomorrowStart;
    });
    const sessionsThisWeek = studies.filter((study) => {
      const date = new Date(study.startTime || study.createdAt);
      return date >= weekStart && date < nextWeekStart;
    });
    const activeSession = studies.find(
      (study) => study.status === "active" || study.status === "paused",
    );
    const dailyGoals = goals.filter((goal) => {
      const deadline = new Date(goal.deadline);
      return deadline >= todayStart && deadline < tomorrowStart;
    });
    const weeklyGoals = goals.filter((goal) => {
      const deadline = new Date(goal.deadline);
      return deadline >= weekStart && deadline < nextWeekStart;
    });

    return {
      todayDuration: sessionsToday.reduce(
        (total, study) => total + durationOf(study, now),
        0,
      ),
      weeklyDuration: sessionsThisWeek.reduce(
        (total, study) => total + durationOf(study, now),
        0,
      ),
      activeSession,
      dailyGoals,
      weeklyGoals,
      weeklyProgress: progressOf(weeklyGoals),
    };
  }, [goals, studies]);

  return (
    <DashboardLayout tittle={tittle}>
      <WelcomeCard />

      {error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <StatsCard
          title="Today's Study"
          value={loading ? "—" : formatDuration(dashboard.todayDuration)}
          subtitle={
            loading
              ? "Loading sessions..."
              : `${dashboard.todayDuration ? "Tracked from today's sessions" : "No study time recorded today"}`
          }
        />
        <StatsCard
          title="Current Study"
          value={loading ? "—" : dashboard.activeSession?.subject || "None"}
          subtitle={
            loading
              ? "Loading sessions..."
              : dashboard.activeSession
                ? `${dashboard.activeSession.status === "paused" ? "Paused" : "Active"}${dashboard.activeSession.topic ? ` · ${dashboard.activeSession.topic}` : ""}`
                : "Start a study session to see it here"
          }
        />
        <StatsCard
          title="Weekly Study"
          value={loading ? "—" : formatDuration(dashboard.weeklyDuration)}
          subtitle={loading ? "Loading sessions..." : "Tracked since Monday"}
        />
        <StatsCard
          title="Weekly Goal"
          value={loading ? "—" : `${dashboard.weeklyProgress}%`}
          subtitle={
            loading
              ? "Loading goals..."
              : dashboard.weeklyGoals.length
                ? `${dashboard.weeklyGoals.length} goal${dashboard.weeklyGoals.length === 1 ? "" : "s"} due this week`
                : "No goals due this week"
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <StudyChart studies={studies} />
        </div>
        <PomodoroCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <GoalProgress goals={dashboard.weeklyProgress} loading={loading} />
        <RecentSessions sessions={studies} loading={loading} error={error} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
