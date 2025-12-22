"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Define TypeScript type for Video
interface Video {
  _id: string;
  url: string;
  createdAt?: string;
}

export default function VideoUpload() {
  const [url, setUrl] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [message, setMessage] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get("https://nascent.virtualshopbd.com/api/banner/videos");
      if (res.data.success) setVideos(res.data.videos as Video[]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!url.trim()) return setMessage("⚠️ Please enter a video URL");

    try {
      if (editingId) {
        // Update existing video
        await axios.put(`https://nascent.virtualshopbd.com/api/banner/videos/${editingId}`, { url });
        setMessage("✅ Video updated successfully!");
        setEditingId(null);
      } else {
        // Create new video
        await axios.post("https://nascent.virtualshopbd.com/api/banner/upload-video", { url });
        setMessage("✅ Video uploaded successfully!");
      }

      setUrl("");
      fetchVideos();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save video");
    }
  };

  const handleEdit = (video: Video) => {
    setUrl(video.url);
    setEditingId(video._id);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-black items-center px-4 py-12">
      {/* Upload Card */}
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          {editingId ? "Edit Video URL" : "Upload Video URL"}
        </h2>

        <input
          type="text"
          placeholder="Paste YouTube or Vimeo URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-5 transition shadow-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300"
        >
          {editingId ? "Update Video" : "Submit"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-400 text-xs">
          Paste a valid YouTube or Vimeo URL. Maximum 1 per entry.
        </p>
      </div>

      {/* Video List */}
      <div className="w-full max-w-lg space-y-4">
        {videos.length === 0 && (
          <p className="text-center text-gray-400 text-sm">No videos uploaded yet.</p>
        )}

        {videos.map((video) => (
          <div
            key={video._id}
            className="flex justify-between items-center bg-white p-4 rounded-2xl shadow hover:shadow-xl transition"
          >
            <p
              className="truncate text-gray-800 max-w-xs"
              title={video.url} // hover tooltip
            >
              {video.url}
            </p>
            <button
              onClick={() => handleEdit(video)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
