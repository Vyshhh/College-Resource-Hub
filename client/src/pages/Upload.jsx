import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Upload() {
  const [form, setForm] = useState({ title: "", subject: "", semester: "", tags: "" });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("file", file);

    try {
      await API.post("/resources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Uploaded successfully");
      navigate("/");
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      {/* Blurred blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff40_1px,transparent_1px),linear-gradient(to_bottom,#ffffff40_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-1/3 w-6 h-6 bg-indigo-400 rounded-full opacity-40 animate-ping"></div>
      <div className="absolute bottom-40 right-1/4 w-8 h-8 bg-pink-400 rounded-full opacity-30 animate-ping"></div>

      {/* Upload card with glow */}
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 blur-3xl opacity-20"></div>

        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
            📤 Upload Resource
          </h2>

          <form onSubmit={handleUpload} className="space-y-5">
            <input className="border w-full p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="Title"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="border w-full p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="Subject"
              value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <input className="border w-full p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="Semester"
              value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            <input className="border w-full p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder="Tags (comma separated)"
              value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-indigo-400 transition">
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
              <p className="text-gray-500 text-sm mt-2">Upload PDF only</p>
            </div>

            <button type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 shadow-lg hover:opacity-90 transform hover:scale-105 transition">
              🚀 Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
