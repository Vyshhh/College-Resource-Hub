import { useEffect, useState } from "react";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Stats({ role }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = role === "admin" ? "/admin/stats" : "/admin/student-stats";

    API.get(endpoint)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Stats error:", err);
        setLoading(false);
      });
  }, [role]);

  const deleteMyResource = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await API.delete(`/admin/student-resources/${id}`);
    setStats({
      ...stats,
      myUploads: stats.myUploads.filter((r) => r._id !== id),
    });
    alert("Resource deleted");
  };

  if (loading) return <p className="text-gray-500">Loading stats...</p>;

  const COLORS = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-pink-200 p-8">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        📊 Platform Statistics
      </h2>

      {role === "admin" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-indigo-500 text-white p-6 rounded-lg">Users: {stats.totalUsers}</div>
            <div className="bg-pink-500 text-white p-6 rounded-lg">Resources: {stats.totalResources}</div>
            <div className="bg-green-500 text-white p-6 rounded-lg">Downloads: {stats.totalDownloads}</div>
          </div>

          {/* Most Active Users */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              👥 Most Active Users
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.mostActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uploads" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <>
          {/* My Uploads */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">📂 My Uploads</h3>
            {stats.myUploads.length === 0 ? (
              <p>No uploads yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.myUploads.map((r) => (
                  <li
                    key={r._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow"
                  >
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-sm text-gray-600">
                        {r.subject} | Downloads: {r.downloads}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMyResource(r._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Top Resources Pie Chart */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              🔥 Top Resources (by downloads)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.topResources}
                  dataKey="downloads"
                  nameKey="title"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.topResources.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
