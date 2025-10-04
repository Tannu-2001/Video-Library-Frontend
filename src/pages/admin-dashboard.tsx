import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { VideoContract } from "../contracts/VideoContract";

const AdminDashboard: React.FC = () => {
  const [videos, setVideos] = useState<VideoContract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Token check
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ✅ Fetch videos
  useEffect(() => {
    api
      .get("/videos")
      .then((res) => {
        setVideos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading videos...</p>;
  }

return (
  <div className="min-h-screen w-full bg-white p-8">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🎬 Admin Dashboard</h2>
      <br></br>

      {/* Logout Button + Add Video */}
      <div className="mb-6 flex justify-between w-full">
        <Link
          to="/add-video"
          className="bg-blue-600 text-dark px-4 py-2 rounded hover:bg-blue-700"
        >
        
         <button className="btn btn-warning">➕ Add New Video</button>
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            navigate("/admin-login");
          }}
          className="bg-red-600 text-dark px-4 py-2 rounded hover:bg-red-700 btn btn-warning"
        >
          🚪 Logout
        </button>
      </div>
      <br></br>

      {/* Videos Table */}
      {videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <table className="w-full border-6 border-dark bg-white">
          <thead>
            <tr className="bg-white">
              <th className="border-2 p-4">Title</th>
              <th className="border-2 p-2">Category</th>
              <th className="border-2 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr key={video._id}>
                <td className="border-2 p-2">{video.title}</td>
                <td className="border-2 p-3">
                  {video.categoryName||video.category||"uncategorized"}
              
                </td>
                <td className="border-2  p-3 flex gap-2">
                  <Link
                    to={`/edit-video/${video._id}`}
                    className="bg-green-600 text-dark px-2 py-1 rounded hover:bg-green-700"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/delete-video/${video._id}`}
                    className="bg-red-600 text-dark px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
)};
export default AdminDashboard;