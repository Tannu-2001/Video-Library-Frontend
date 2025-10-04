import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { VideoContract } from "../contracts/VideoContract";

const getYoutubeThumb = (url?: string) => {
  if (!url) return "";
  try {
    if (url.includes("youtube.com/embed/")) {
      const id = url.split("/embed/")[1]?.split(/[?&]/)[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    }
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://img.youtube.com/vi/${v}/hqdefault.jpg`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    }
  } catch {
    const m = (url || "").match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`;
  }
  return "";
};

const VideoLibraryHome: React.FC = () => {
  const [videos, setVideos] = useState<VideoContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/videos")
      .then((res) => {
        if (!isMounted) return;
        setVideos(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        if (!isMounted) return;
        setError("Failed to load videos. Please try again.");
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);



  const filteredVideos = videos.filter((video) =>
    (video.title || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6 text-center">Loading videos...</p>;

  return (
    <div style={{ minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        {/* Header like UserDashboard */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ margin: 0 }}>🎥 Video Library</h2>

        </header>

        {/* Search */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" text-white border rounded px-3 py-2 w-full max-w-xl"
          />
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* Video list: use same card style as dashboard */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,3fr))",
          gap: 12,
          alignItems: "start"
        }}>
          {filteredVideos.map((v) => {
            const thumb = v.thumbnail?.trim() || getYoutubeThumb(v.url);
            return (
              <div key={v._id} style={{ background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(168, 201, 211, 0.08)" }}>
                <div style={{ width: "100%", height: 4, paddingBottom: "56.25%", position: "relative", background: "#def4e2ff" }}>
                  <img
                    src={thumb || "https://via.placeholder.com/400x225?text=No+Image"}
                    alt={v.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div style={{ padding: 12 }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>{v.title || "Untitled"}</h3>
                  <p style={{ margin: "0 0 12px 0", color: "#171414ff", fontSize: 14, minHeight: 36 }}>{v.description || "No description"}</p>

                  <div style={{ display: "flex", gap: 10 }}>

                   
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && videos.length === 0 && <p style={{ marginTop: 20, textAlign: "center" }}>No videos available.</p>}
      </div>
    </div>
  );
};

export default VideoLibraryHome;