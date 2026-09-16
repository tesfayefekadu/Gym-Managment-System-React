import { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Area */}

      <div
        className={`flex-1 min-w-0 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >

        {/* Top Bar */}

        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 sticky top-0 z-30">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen((previous) => !previous)
            }
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition"
            aria-label={
              sidebarOpen
                ? "Collapse sidebar"
                : "Expand sidebar"
            }
          >
            <span className="text-xl">
              {sidebarOpen ? "☰" : "☰"}
            </span>
          </button>

          <div className="ml-4">
            <h1 className="font-semibold text-gray-800">
              Gym Management System
            </h1>
          </div>

        </header>

        {/* Page Content */}

        <main className="p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default Layout;