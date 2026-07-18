import DashboardLayout from "../layouts/DashboardLayout";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import StudyChart from "../components/dashboard/StudyChart";
import PomodoroCard from "../components/dashboard/PomodoroCard";
import GoalProgress from "../components/dashboard/GoalProgress";
import RecentSessions from "../components/dashboard/RecentSessions";

import { FaBookOpen, FaFire, FaBullseye, FaStar } from "react-icons/fa";
const tittle="Dashboard"
const Dashboard = () => {
  return (
    <DashboardLayout tittle={tittle}>
      <WelcomeCard />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <StatsCard
          title="Today's Study"
          value="2h 30m"
          subtitle="+30 mins from yesterday"
          //icon={<FaBookOpen className="text-blue-500 text-4xl" />}
        />

        <StatsCard
          title="Current Streak"
          value="15"
          subtitle="Keep Going!"
          //icon={<FaFire className="tex-orange-500 text-4xl" />}
        />

        <StatsCard
          title="Weekly Goal"
          value="80%"
          subtitle="2 hours remaining"
          //icon={<FaBullseye className="text-green-500 text-4xl" />}
        />

        <StatsCard
          title="Experience"
          value="1250 XP"
          subtitle="Level 5"
          //icon={<FaStar className="text-yellow-500 text-4xl" />}
        />
      </div>

      {/* Chart + Pomodoro */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
          <StudyChart />
        </div>
        <PomodoroCard />
      </div>

      {/* Goal + Sessions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <GoalProgress />
        <RecentSessions />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
