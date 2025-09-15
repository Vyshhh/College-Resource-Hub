import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { ...form, role: "student" });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      alert("Registered successfully!");
      navigate("/");
    } catch {
      alert("User already exists");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-white to-pink-200">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us and explore amazing opportunities 🚀
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
