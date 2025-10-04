import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { VideoContract } from "../contracts/VideoContract";

const DeleteVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!id) {
      alert("Missing video id");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      const res = await api.delete(`/videos/${id}`);
      if (res.status === 200 || res.status === 204 || (res.data && res.data.success)) {
        alert("Video deleted successfully ✅");
        navigate("/admin-dashboard");
      } else {
        console.warn("Unexpected delete response:", res);
        alert("Delete request completed but response unexpected. Check server logs.");
      }
    } catch (err: any) {
      console.error("Error deleting video:", err);
      const msg = err?.response?.data?.message || err.message || "Failed to delete video";
      alert("Failed to delete video ❌\n\n" + msg);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Delete Video</h2>

      <p className="mb-4">
        This will permanently delete the video. Click the button below to confirm.
      </p>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-dark px-4 py-2 rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>

        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-400 text-dark px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteVideo;