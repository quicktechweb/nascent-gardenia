"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type FeedData = {
  _id: string;
  title1: string;
  title2: string;
  videos: string[];
};

export default function InstagramFeed() {
  const [feed, setFeed] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchFeed = async () => {
    try {
      const res = await axios.get<FeedData[]>(
        "https://nascent.virtualshopbd.com/api/instagram"
      );
      setFeed(res.data[0] || null);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // ================= SKELETON COMPONENT =================
  const Skeleton = ({ count }: { count: number }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="w-full h-[130px] sm:h-[180px] md:h-[380px] rounded-lg bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b md:px-28 from-[#0f3333] via-[#0c0c0c] to-[#0f3333] ">
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          {loading ? (
            <div className="space-y-2">
              <div className="w-32 h-4 mx-auto bg-gray-600 rounded animate-pulse"></div>
              <div className="w-64 h-10 mx-auto bg-gray-600 rounded animate-pulse"></div>
            </div>
          ) : feed ? (
            <>
              <p className="text-sm text-white mt-16">SOCIAL MEDIA •</p>
              <h2 className="text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.25)]">
                {feed.title1} <span className="text-yellow-400">{feed.title2}</span>
              </h2>
            </>
          ) : (
            <p className="text-white mt-16">No feed available.</p>
          )}
        </div>

        {/* Video Grid */}
        {loading ? (
          <Skeleton count={5} />
        ) : feed && feed.videos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 justify-center">
            {feed.videos.map((videoSrc, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg w-full h-[130px] sm:h-[180px] md:h-[380px]"
              >
                <video
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center mt-10">No videos available.</p>
        )}
      </section>
    </div>
  );
}
