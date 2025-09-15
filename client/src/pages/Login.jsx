import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-white to-pink-200">
      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full min-h-[550px]">
        {/* Left side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-b from-indigo-100 to-pink-100 items-center justify-center">
          <img
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="Login illustration"
            className="max-h-96"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              
              <Link to="/register" className="text-indigo-600 hover:underline">
                Create an account
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
