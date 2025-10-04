import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface Video {
  _id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  url?: string;
  categoryName?: string;
}

const SavedVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("Please login to see saved videos.");
          return;
        }
        const res = await api.get("/videos/saved-videos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data || []);
      } catch (err: any) {
        console.error("fetchSaved error:", err);
        setError(err?.response?.data?.message || "Failed to load saved videos");
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

const thumbFromUrl = (url?: string, fallback?: string) => {
    if (!url) return fallback || "https://via.placeholder.com/400x225?text=No+Image";
    try {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const m = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
      }
    } catch {}
    return fallback || "https://via.placeholder.com/400x225?text=No+Image";
  };


  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>💾 Saved Videos</h2>
        <button onClick={() => navigate(-1)} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "white" }}>
          ← Back
        </button>
      </div>

      {loading && <p>Loading saved videos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
        gap: 24,
      }}>
        {videos.map((v) => (
            <div key={v._id} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(168, 201, 211, 0.08)" }}>
              <div style={{ width: "100%", height: 4, paddingBottom: "56.25%", position: "relative", background: "#def4e2ff" }}>
                <img
                  src={v.thumbnail || thumbFromUrl(v.url)}
                  alt={v.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

            <div style={{ padding: 12 }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{v.title || "Untitled"}</h3>
              <p style={{ margin: 0, color: "#444" }}>{v.description?.slice(0, 120) || "No description"}</p>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button onClick={() => navigate(`/watch/${v._id}`)} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#2563eb", color: "white" }}>
                  ▶ Watch
                </button>
               

                <button
          onClick={async () => {
            try {
              const token = localStorage.getItem("userToken");
              await api.post(
                "/videos/remove-saved-video",
                { videoId: v._id },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              alert("Video removed");
              setVideos(videos.filter((vid) => vid._id !== v._id));
            } catch (err) {
              console.error("Remove error:", err);
              alert("Failed to remove video");
            }
          }}
          className="flex-1 bg-white text-danger py-2 rounded hover:bg-red-600"
        >
          ❌ Remove
        </button>



              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && videos.length === 0 && <p>No saved videos yet.</p>}
    </div>
  );
};

export default SavedVideos;