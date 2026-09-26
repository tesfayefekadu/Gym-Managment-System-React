import { getCurrentUser } from "../../services/authService";

function Navbar() {
  const user = getCurrentUser();

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">

      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <div className="text-right">
        <p className="font-semibold text-gray-800">
          {user?.name || "User"}
        </p>

        <p className="text-sm text-gray-500">
          {user?.role || "Staff"}
        </p>
      </div>

    </header>
  );
}

export default Navbar;