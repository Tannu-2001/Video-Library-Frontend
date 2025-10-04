import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { VideoContract } from "../contracts/VideoContract";
import { CategoryContract } from "../contracts/CategoryContract";

const initialVideo: VideoContract = {
  title: "",
  description: "",
  url: "",
  category: "", 
  thumbnail: "",
} as VideoContract;

const EditVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [video, setVideo] = useState<VideoContract>(initialVideo);
  const [categories, setCategories] = useState<CategoryContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]);
      });

    if (id) {
      api
        .get(`/videos/${id}`)
        .then((res) => {
          const v = res.data || {};

          const catId =
            v.category_id ||
            (v.category && (typeof v.category === "string" ? v.category : v.category._id)) ||
            "";

          setVideo({
            title: v.title || "",
            description: v.description || "",
            url: v.url || "",
            category: catId,
            thumbnail: v.thumbnail || "",
          } as VideoContract);
        })
        .catch((err) => {
          console.error("Error fetching video:", err);
        
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const normalizeUrl = (raw: string) => {
    if (!raw) return "";
    let u = raw.trim();
    if (u.endsWith(";")) u = u.slice(0, -1);
    return u;
  };

  const handleReset = () => setVideo(initialVideo);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: (video.title || "").trim(),
      description: (video.description || "").trim(),
      url: normalizeUrl(video.url || ""),
      category_id: (video.category || "").trim(), 
      thumbnail: (video.thumbnail || "").trim(),
    };

    if (!payload.title || !payload.url || !payload.category_id) {
      alert("Please fill Title, URL and select Category.");
      return;
    }

    try {
      const token =
        localStorage.getItem("adminToken") || localStorage.getItem("userToken");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      console.log("Updating video payload:", payload);
      await api.put(`/videos/${id}`, payload, { headers });

      alert("Video updated successfully ✅");
      navigate("/admin-dashboard");
    } catch (err: any) {
      console.error("Error updating video:", err);
      const serverMsg =
        err?.response?.data?.message || err?.message || "Failed to update video";
      alert("Failed to update video ❌\n\n" + serverMsg);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading video details...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">✏️ Edit Video</h2>

      <form onSubmit={handleUpdate} className="bg-white border rounded shadow-sm">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="p-3 border bg-gray-50 text-left">Title</th>
              <th className="p-3 border bg-gray-50 text-left">Description</th>
              <th className="p-3 border bg-gray-50 text-left">Video URL</th>
              <th className="p-3 border bg-gray-50 text-left">Category</th>
              <th className="p-3 border bg-gray-50 text-left">Thumbnail (optional)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-4 border align-top w-1/5">
                <input
                  type="text"
                  placeholder="Enter Title"
                  value={video.title}
                  onChange={(e) => setVideo({ ...video, title: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </td>

              <td className="p-4 border align-top w-2/5">
                <textarea
                  placeholder="Enter Description"
                  value={video.description}
                  onChange={(e) =>
                    setVideo({ ...video, description: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  rows={6}
                />
              </td>

              <td className="p-4 border align-top w-1/5">
                <input
                  type="text"
                  placeholder="Enter Video URL (use embed URL)"
                  value={video.url}
                  onChange={(e) => setVideo({ ...video, url: e.target.value })}
                  className="w-full border p-2 rounded mb-2"
                />
                <p className="text-xs text-gray-500">
                  Use embed URL (https://www.youtube.com/embed/VIDEO_ID)
                </p>
              </td>

              <td className="p-4 border align-top w-1/5">
                <select
                  value={video.category || ""}
                  onChange={(e) => setVideo({ ...video, category: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-4 border align-top w-1/5">
                <input
                  type="text"
                  placeholder="Optional thumbnail URL"
                  value={video.thumbnail}
                  onChange={(e) =>
                    setVideo({ ...video, thumbnail: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Optional: image URL to show in list
                </p>
              </td>
            </tr>

            <tr>
              <td colSpan={5} className="p-4 border bg-gray-50">
                <div className="flex items-center gap-3">
                  <button type="submit" className="bg-dark text-white px-4 py-2 rounded">
                    Update Video
                  </button>
                  <button type="button" onClick={handleReset} className="bg-gray-200 px-4 py-2 rounded">
                    Reset
                  </button>
                  <button type="button" onClick={() => navigate("/admin-dashboard")} className="bg-white border px-4 py-2 rounded">
                    Cancel
                  </button>
                  <div className="ml-auto text-sm text-gray-500">
                  
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default EditVideo;
