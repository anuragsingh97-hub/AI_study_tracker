import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

const DashboardLayout = ({ children, tittle, lockPageScroll = false }) => {

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="z-1 flex flex-1 flex-col overflow-hidden">
        <Navbar tittle={tittle} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-2 lg:p-1">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
