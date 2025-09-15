import { useEffect, useState } from "react";
import API from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    API.get("/admin/users").then(res => setUsers(res.data));
    API.get("/admin/stats").then(res => setStats(res.data));
    API.get("/admin/resources").then(res => setResources(res.data));
  }, []);

  const changeRole = async (id, role) => {
    await API.put(`/admin/users/${id}/role`, { role });
    setUsers(users.map(u => (u._id === id ? { ...u, role } : u)));
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await API.put(`/admin/users/${id}/status`, { status: newStatus });
    setUsers(users.map(u => (u._id === id ? { ...u, status: newStatus } : u)));
    alert(`User ${newStatus}`);
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await API.delete(`/resources/${id}`);
    setResources(resources.filter(r => r._id !== id));
    alert("Resource deleted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-pink-300 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700">
          👨‍💼 Admin Dashboard
        </h2>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Users</h3>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Resources</h3>
              <p className="text-2xl font-bold">{stats.totalResources}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-300 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Downloads</h3>
              <p className="text-2xl font-bold">{stats.totalDownloads}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white/90 backdrop-blur-md shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Users</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u._id}
                  className={`hover:bg-gray-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3 capitalize">{u.status}</td>
                  <td className="p-3 space-x-2">
                    {u.role === "student" ? (
                      <button
                        onClick={() => changeRole(u._id, "admin")}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => changeRole(u._id, "student")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Demote
                      </button>
                    )}

                    <button
                      onClick={() => toggleStatus(u._id, u.status)}
                      className={`px-3 py-1 rounded text-white ${
                        u.status === "active"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {u.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resources Table */}
        <div className="bg-white/90 backdrop-blur-md shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Resources</h3>
          {resources.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Title</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Uploader</th>
                  <th className="p-3">Downloads</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r, i) => (
                  <tr
                    key={r._id}
                    className={`hover:bg-gray-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{r.title}</td>
                    <td className="p-3">{r.subject}</td>
                    <td className="p-3">{r.uploadedBy?.email}</td>
                    <td className="p-3">{r.downloads}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteResource(r._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No resources available</p>
          )}
        </div>
      </div>
    </div>
  );
}
