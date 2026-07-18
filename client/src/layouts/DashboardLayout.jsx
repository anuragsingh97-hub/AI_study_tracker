import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children, tittle }) => {

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="z-1 flex flex-1 flex-col overflow-hidden">
        <Navbar tittle={tittle} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
