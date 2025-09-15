import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ResourceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [rating, setRating] = useState({ score: 0, feedback: "" });
  const role = localStorage.getItem("role");

  // ✅ Fetch all resources, find the one by id
  useEffect(() => {
    API.get("/resources").then((res) => {
      const found = res.data.find((r) => r._id === id);
      setResource(found);
    });
  }, [id]);

  // ✅ Submit rating
  const handleRate = async () => {
    try {
      await API.post(`/rating/${id}/rate`, rating);
      const res = await API.get("/resources");
      setResource(res.data.find((r) => r._id === id));
      alert("Rated successfully");
      setRating({ score: 0, feedback: "" });
    } catch {
      alert("Rating failed");
    }
  };

  // ✅ Admin-only: delete resource
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await API.delete(`/resources/${id}`);
      alert("Resource deleted successfully");
      navigate("/"); // go back to dashboard
    } catch {
      alert("Delete failed");
    }
  };

  if (!resource) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-pink-400 p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Resource Info */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-indigo-700">{resource.title}</h2>
          <p className="text-gray-600 mt-2">
            {resource.subject} | Semester {resource.semester}
          </p>
          <p className="mt-3 font-medium">
            ⭐ Average Rating:{" "}
            {resource.avgRating ? resource.avgRating.toFixed(2) : "0.0"} (
            {resource.ratings?.length || 0} reviews)
          </p>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-md p-4">
          <iframe
            src={`http://localhost:5000/api/resources/${resource._id}/view`}
            width="100%"
            height="600px"
            title="PDF Viewer"
            className="rounded-lg shadow-inner"
          />
          <div className="mt-4 flex items-center gap-3">
            <a
              href={`http://localhost:5000/api/resources/${resource._id}/download`}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
            >
               Download PDF
            </a>
            {role === "admin" && (
              <button
                onClick={handleDelete}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                 Delete Resource
              </button>
            )}
          </div>
        </div>

        {/* Rating Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Rate this Resource</h3>

          {/* ⭐ Star Rating */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating({ ...rating, score: star })}
                className={`text-3xl transition ${
                  star <= rating.score ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={rating.feedback}
            onChange={(e) => setRating({ ...rating, feedback: e.target.value })}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
            placeholder="Write your feedback..."
          />

          <button
            onClick={handleRate}
            className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            Submit Rating
          </button>
        </div>

        {/* Reviews */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          {resource.ratings?.length > 0 ? (
            <div className="space-y-4">
              {resource.ratings
                .slice()
                .reverse()
                .map((r, idx) => (
                  <div
                    key={r._id || idx}
                    className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 shadow-sm"
                  >
                    <p className="font-medium">⭐ {r.score}</p>
                    <p className="text-gray-700">{r.feedback}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
