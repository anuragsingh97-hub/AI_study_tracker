import {
  FaChartPie,
  FaBookOpen,
  FaBullseye,
  FaRobot,
  FaUser,
  FaSignOutAlt,
  FaBrain,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();

  const menus = [
    {
      title: "Dashboard",
      icon: <FaChartPie />,
      path: "/dashboard",
    },
    {
      title: "Study",
      icon: <FaBookOpen />,
      path: "/study",
    },
    {
      title: "Goals",
      icon: <FaBullseye />,
      path: "/goals",
    },
    {
      title: "AI Assistant",
      icon: <FaRobot />,
      path: "/ai",
    },
    {
      title: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },
  ];

  return (
    <aside className=" w-72 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="p-6">

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px]">

          <div className="rounded-2xl bg-slate-950 px-5 py-4">

            <div className="flex items-center gap-4">

              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">

                <FaBrain className="text-white text-xl"/>

              </div>

              <div>

                <h1 className="text-xl font-bold text-white">
                  AI Study
                </h1>

                <p className="text-xs text-slate-400">
                  Productivity Hub
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 px-4" style={{marginTop:"10px"}}>


        <nav className="space-y-3" >

          {menus.map((menu) => (

            <NavLink
              key={menu.title}
              to={menu.path}
            >
              {({ isActive }) => (

                <div
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-2 cursor-pointer transition-all duration-300

                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white hover:translate-x-2"
                  }` }  style={{marginTop:"10px"}}
                >

                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center

                    ${
                      isActive
                        ? "bg-white/20"
                        : "bg-slate-800 group-hover:bg-slate-700"
                    }`}
                  >

                    {menu.icon}

                  </div>

                  <span className="font-medium">
                    {menu.title}
                  </span>

                </div>

              )}
            </NavLink>

          ))}

        </nav>

      </div>

      {/* Logout */}
<div className="p-6 border-t border-slate-800 mt-auto">
  <button
    onClick={logout}
    className="w-full rounded-2xl bg-slate-900 hover:bg-red-600 border border-slate-700 hover:border-red-500 py-3 text-white flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
  >
    <FaSignOutAlt />
    Logout
  </button>
</div>

    </aside>
  );
};

export default Sidebar;