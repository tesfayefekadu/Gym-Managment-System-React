import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">
        Gym Management System
      </h2>

      <ul className="space-y-4">
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>

        <li>
          <NavLink to="/members">Members</NavLink>
        </li>

        <li>
          <NavLink to="/trainers">Trainers</NavLink>
        </li>

        <li>
          <NavLink to="/memberships">Memberships</NavLink>
        </li>

        <li>
          <NavLink to="/attendance">Attendance</NavLink>
        </li>

        <li>
          <NavLink to="/payments">Payments</NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;