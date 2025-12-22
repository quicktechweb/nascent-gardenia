"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type InstagramFeedData = {
  _id?: string;
  title1: string;
  title2: string;
  videos: string[];
};

export default function InstagramFeed() {
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [videos, setVideos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH FEED =================
  const fetchFeed = async () => {
    try {
      const res = await axios.get<InstagramFeedData>(
        "https://nascent.virtualshopbd.com/api/instagram"
      );

      setTitle1(res.data?.title1 ?? "");
      setTitle2(res.data?.title2 ?? "");
      setVideos(res.data?.videos ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // ================= ADD VIDEO =================
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title1.trim() || !title2.trim() || !videoUrl.trim()) {
      alert("Title 1, Title 2 & Video URL required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://nascent.virtualshopbd.com/api/instagram/add", {
        title1,
        title2,
        video: videoUrl,
      });

      setVideoUrl("");
      fetchFeed();
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 text-black">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold tracking-tight">
            {title1 || "Instagram Feed"}
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            {title2 || "Manage your reels & videos"}
          </p>
        </div>

        {/* ================= ADMIN FORM ================= */}
        <form
          onSubmit={handleAddVideo}
          className="max-w-xl mx-auto mb-16 bg-white rounded-2xl shadow-lg p-6 space-y-4"
        >
          <input
            value={title1}
            onChange={(e) => setTitle1(e.target.value)}
            placeholder="Title 1"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <input
            value={title2}
            onChange={(e) => setTitle2(e.target.value)}
            placeholder="Title 2"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400"
          />

          <button
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Video"}
          </button>
        </form>

        {/* ================= VIDEO GRID ================= */}
        {videos.length === 0 ? (
          <p className="text-center text-gray-400">
            No videos added yet
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {videos.map((src, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="aspect-[9/16] bg-black">
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end">
                  <p className="text-white text-xs p-3">
                    {title1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
