import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";

interface Video {
  _id: string;
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  categoryName?: string;
}

const UserDashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName,setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const storedName = localStorage.getItem("userName");
  if (storedName) {
    setUserName(storedName);
  }
}, []);

  const fetchSaved = async () => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) return setSavedVideos([]); // not logged in
    const res = await api.get("/videos/saved-videos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSavedVideos(Array.isArray(res.data) ? res.data : []);
  } catch (e) {
    console.error("fetchSaved error:", e);
    setSavedVideos([]);
  }
};

useEffect(() => {
  fetchSaved();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const handleSave = async (videoId: string) => {
  try {
    const token = localStorage.getItem("userToken");
    await api.post(
      "/videos/save-video",
      { videoId},
      {
        headers: { Authorization:`Bearer ${token}`},
      }
    );
    alert("Video saved!");
  } catch (err) {
    console.error("Save error:", err);
    alert("Failed to save video");
  }
};


const [savedVideos, setSavedVideos] = useState<Video[]>([]);

useEffect(() => {
  const fetchSaved = async () => {
    const token = localStorage.getItem("userToken");
    const res = await api.get("/videos/saved-videos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSavedVideos(res.data);
  };
  fetchSaved();
}, []);


  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/user-login");
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("userToken");
        if (!token) {
          // for debug: do not redirect immediately — show message
          setError("No user token found. Please login.");
          setLoading(false);
          return;
        }

        const res = await api.get("/videos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // expect array; try to handle a few shapes
        if (Array.isArray(res.data)) {
          setVideos(res.data);
        } else if (res.data?.videos && Array.isArray(res.data.videos)) {
          setVideos(res.data.videos);
        } else if (res.data) {
          // fallback: if backend returned object map
          setVideos(Array.isArray(res.data) ? res.data : []);
        } else {
          setVideos([]);
        }
      } catch (err: any) {
        console.error("fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load videos");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // helper: thumbnail from youtube url or fallback image
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
    <div style={{ background:"" ,minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1500, margin: "4" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ margin: 0 }}>🎥 User Dashboard</h2>

         <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    {/* Saved Videos button (naya) */}
    <Link to="/saved-videos" style={{
      background: "#10b981",
      color: "white",
      padding: "8px 12px",
      borderRadius: 6,
      textDecoration: "none",
      fontWeight: 600
    }}>
      💾 Saved Videos
    </Link>

   
  {userName ? (
  
    <span style={{ marginRight: 20, fontWeight: "bold" }}>👤 {userName}</span>
  ) : null}

<button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: 6 }}>
  Logout</button>

  </div>
        </header>

        {loading && <p>Loading videos…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: 50,
            alignItems: "start",
          }}
        >
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
                <h3 style={{ margin: "0 0 8px 0", fontSize: 16 }}>{v.title || "Untitled"}</h3>
                <p style={{ margin: "0 0 12px 0", color: "#171414ff", fontSize: 14, minHeight: 36 }}>{v.description || "No description"}</p>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => navigate(`/watch/${v._id}`)}
                    style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: 6 }}
                  >
                    ▶ Watch
                  </button>


                  <button
                    onClick={() => handleSave(v._id)}
                    style={{ background: "#8debb3ff", color: "white", border: "none", padding: "10px 10px", borderRadius: 6 }}
                  >
                       💾 Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && videos.length === 0 && <p style={{ marginTop: 20 }}>No videos available.</p>}




      </div>
    </div>
  );
};

export default UserDashboard;


