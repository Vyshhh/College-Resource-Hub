import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // stored at login

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        📚 College Resource Hub
      </Link>
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            {/* ✅ Show role when logged in */}
            <span className="text-sm text-gray-600">
              Role: <b>{role}</b>
            </span>

            {/* ✅ Only admins see dashboard link */}
            {role === "admin" && (
              <Link to="/admin" className="text-indigo-600 font-semibold">
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
