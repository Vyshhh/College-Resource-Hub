import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [resources, setResources] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [mostDownloaded, setMostDownloaded] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/resources").then((res) => setResources(res.data));
    API.get("/resources/top-rated?limit=3").then((res) => setTopRated(res.data));
    API.get("/resources/most-downloaded?limit=3").then((res) =>
      setMostDownloaded(res.data)
    );

    if (localStorage.getItem("token")) {
      API.get("/resources/recommendations").then((res) =>
        setRecommendations(res.data)
      );
    }
  }, []);

  const filtered = resources.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.semester?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Reusable card
  const ResourceCard = ({ r, showView = true }) => (
    <div
      key={r._id}
      className="relative bg-white/70 backdrop-blur-md border border-indigo-300 shadow-lg rounded-xl p-6 hover:shadow-2xl hover:-translate-y-1 transform transition duration-300"
    >
      {/* gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-pink-500 rounded-t-xl" />
      <h4 className="font-bold text-indigo-700 mt-2">{r.title}</h4>
      <p className="text-sm text-gray-600">
        {r.subject} • Sem {r.semester}
      </p>
      {r.downloads !== undefined ? (
        <p className="mt-2 text-sm">⬇ Downloads: {r.downloads}</p>
      ) : (
        <p className="mt-2 text-sm">⭐ {r.avgRating?.toFixed(2) || "0.0"}</p>
      )}
      {showView && (
        <Link
          to={`/resource/${r._id}`}
          className="text-indigo-600 mt-3 inline-block font-medium hover:underline"
        >
          View →
        </Link>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto space-y-12">
        {/* Title */}
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
          📑 Resources Dashboard
        </h2>

        {/* Search */}
        <section className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-2xl shadow-md">
          <input
            type="text"
            placeholder="🔍 Search resources..."
            className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        {/* ✅ If search query → show only filtered results */}
        {search.trim() ? (
          <section className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 p-6 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-purple-600">
              🔎 Search Results
            </h3>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((r) => (
                  <ResourceCard key={r._id} r={r} showView={true} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No resources found.</p>
            )}
          </section>
        ) : (
          <>
            {/* ✨ Recommended */}
            {recommendations.length > 0 && (
              <section className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-2xl shadow-md">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
                  ✨ Recommended for You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((r) => (
                    <ResourceCard key={r._id} r={r} showView={true} />
                  ))}
                </div>
              </section>
            )}

            {/* 🔥 Top Rated */}
            <section className="bg-gradient-to-r from-yellow-50 via-white to-orange-50 p-6 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-orange-600">
                🔥 Top Rated
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topRated.slice(0, 3).map((r) => (
                  <ResourceCard key={r._id} r={r} showView={false} />
                ))}
              </div>
            </section>

            {/* ⬇ Most Downloaded */}
            <section className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-6 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-blue-600">
                 Most Downloaded
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mostDownloaded.slice(0, 3).map((r) => (
                  <ResourceCard key={r._id} r={r} showView={false} />
                ))}
              </div>
            </section>

            {/* 📂 All Resources */}
            <section className="bg-gradient-to-r from-pink-50 via-white to-indigo-50 p-6 rounded-2xl shadow-md">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-purple-600">
                📂 All Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((r) => (
                  <ResourceCard key={r._id} r={r} showView={true} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
