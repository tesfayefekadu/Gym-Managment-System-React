import { NavLink } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/authService";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = getCurrentUser();
  const userRole = user?.role;

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
      roles: ["Admin", "Manager", "Staff"],
    },
    {
      name: "Members",
      path: "/members",
      icon: "👥",
      roles: ["Admin", "Manager", "Staff"],
    },
    {
      name: "Trainers",
      path: "/trainers",
      icon: "🏋️",
      roles: ["Admin", "Manager"],
    },
    {
      name: "Memberships",
      path: "/membership-plans",
      icon: "📋",
      roles: ["Admin", "Manager"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📅",
      roles: ["Admin", "Manager", "Staff"],
    },
    {
      name: "Payments",
      path: "/payments",
      icon: "💳",
      roles: ["Admin", "Manager", "Staff"],
    },
  ];

  // Show only pages allowed for the logged-in user's role
  const visibleNav = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        z-40
        h-screen
        bg-gray-900
        text-white
        transition-all
        duration-300
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Logo */}
      <div
        className={`
          h-16
          flex
          items-center
          border-b
          border-gray-800
          ${sidebarOpen ? "px-5" : "justify-center"}
        `}
      >
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
          G
        </div>

        {sidebarOpen && (
          <div className="ml-3 overflow-hidden">
            <h1 className="font-bold text-sm whitespace-nowrap">
              Gym Management System
            </h1>

            <p className="text-xs text-gray-400 whitespace-nowrap">
              {user?.role || "User"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 mt-4">
        <ul className="space-y-2">
          {visibleNav.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    sidebarOpen
                      ? "px-4 py-3"
                      : "px-3 py-3 justify-center"
                  }
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                  `
                }
                title={!sidebarOpen ? item.name : ""}
              >
                <span className="text-xl shrink-0">
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <span className="ml-3 font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className={`
          absolute
          bottom-0
          left-0
          right-0
          border-t
          border-gray-800
          p-4
          ${sidebarOpen ? "" : "flex justify-center"}
        `}
      >
        {sidebarOpen ? (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-gray-400 truncate">
                {user?.role || "Unknown Role"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>
            </div>

            <button
              onClick={logout}
              className="shrink-0 text-red-500 hover:text-red-400 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="text-red-500 hover:text-red-400 text-xs"
            title="Logout"
          >
            Out
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;