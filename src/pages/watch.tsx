import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api"; // your axios instance with baseURL

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/videos/${id}`)
      .then((res) => {
        setVideo(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("watch fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load video");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading video...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Failed to load video: {error}</div>;
  if (!video) return <div className="p-6 text-center">Video not found</div>;

  // If video.url contains embed url use iframe, else show thumbnail
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
      <div className="aspect-video mb-4">
        {video.url ? (
          <iframe
            src={video.url}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No preview</div>
        )}
      </div>
      <p>{video.description}</p>
    </div>
  );
};

export default Watch;