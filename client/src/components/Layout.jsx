import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  DocumentIcon,
  UserGroupIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Layout({ children }) {
  const role = localStorage.getItem("role");
const name = localStorage.getItem("name") || "Guest";


  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-300 via-white to-pink-400">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 via-purple-400 to-pink-400 text-white flex flex-col shadow-xl">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center p-6 border-b border-white/30">
          <UserCircleIcon className="w-16 h-16 text-white mb-2" />
          <p className="font-semibold text-lg">{name}</p>
          
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 hover:bg-white/20 transition"
          >
            <HomeIcon className="w-5 h-5" /> Resources
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-5 py-3 hover:bg-white/20 transition"
          >
            <DocumentIcon className="w-5 h-5" /> Upload
          </Link>
          {role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-5 py-3 hover:bg-white/20 transition"
            >
              <UserGroupIcon className="w-5 h-5" /> Admin
            </Link>
          )}
          <Link
            to="/stats"
            className="flex items-center gap-2 px-5 py-3 hover:bg-white/20 transition"
          >
            <ChartBarIcon className="w-5 h-5" /> Stats
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top bar */}
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md p-4 rounded-lg mb-6">
          <h1 className="text-xl font-bold text-indigo-600">
            College Resource Hub
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {role === "admin" ? "👨‍💼 Admin" : "🎓 Student"}
            </span>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
