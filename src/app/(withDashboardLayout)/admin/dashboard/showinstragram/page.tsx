"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEdit, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

type FeedItem = {
  _id: string;
  title1: string;
  title2: string;
  videos: string[];
};

export default function InstagramFeed() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title1: "",
    title2: "",
    videos: [""],
  });

  // ================= FETCH =================
  const fetchFeeds = async () => {
    try {
      const res = await axios.get<FeedItem[]>(
        "https://nascent.virtualshopbd.com/api/instagram"
      );
      setFeeds(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  // ================= OPEN MODAL =================
  const openEditModal = (item: FeedItem) => {
    setEditingId(item._id);
    setFormData({
      title1: item.title1,
      title2: item.title2,
      videos: item.videos.length ? item.videos : [""],
    });
    setShowModal(true);
  };

  // ================= VIDEO HANDLERS =================
  const handleVideoChange = (index: number, value: string) => {
    const updated = [...formData.videos];
    updated[index] = value;
    setFormData({ ...formData, videos: updated });
  };

  const addVideoField = () => {
    setFormData({
      ...formData,
      videos: [...formData.videos, ""],
    });
  };

  const removeVideoField = (index: number) => {
    const updated = formData.videos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      videos: updated.length ? updated : [""],
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!formData.title1 || !formData.title2) {
      return alert("Title 1 & Title 2 required");
    }

    setLoading(true);
    try {
      await axios.put(
        `https://nascent.virtualshopbd.com/api/instagram/${editingId}`,
        {
          title1: formData.title1,
          title2: formData.title2,
          videos: formData.videos.filter((v) => v.trim() !== ""),
        }
      );
      setShowModal(false);
      fetchFeeds();
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update feed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-10 bg-white min-h-screen text-black">

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto  rounded-lg shadow-sm mb-10">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white">
            <tr>
              <th className="border px-4 py-3 text-left">Title 1</th>
              <th className="border px-4 py-3 text-left">Title 2</th>
              <th className="border px-4 py-3 text-left">Videos</th>
              <th className="border px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {feeds.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className=" px-4 py-3 font-medium">{item.title1}</td>
                <td className=" px-4 py-3 font-medium">{item.title2}</td>

                <td className=" px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {item.videos.map((src, i) => (
                      <video
                        key={i}
                        src={src}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-24 h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>

                <td className=" px-4 py-3 text-center">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white items-center gap-1 px-3 py-1 border rounded hover:bg-black hover:text-white transition"
                  >
                    <AiOutlineEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 text-black">

            <h3 className="text-xl font-semibold mb-4">
              Edit Instagram Feed
            </h3>

            {/* TITLE 1 */}
            <input
              value={formData.title1}
              onChange={(e) =>
                setFormData({ ...formData, title1: e.target.value })
              }
              placeholder="Title 1"
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            {/* TITLE 2 */}
            <input
              value={formData.title2}
              onChange={(e) =>
                setFormData({ ...formData, title2: e.target.value })
              }
              placeholder="Title 2"
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            {/* VIDEOS */}
            <div className="mb-4">
              <label className="font-semibold mb-2 block">Video Sources</label>

              {formData.videos.map((video, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    value={video}
                    onChange={(e) =>
                      handleVideoChange(index, e.target.value)
                    }
                    placeholder="Video URL"
                    className="flex-1 px-3 py-2 border rounded"
                  />

                  <button
                    type="button"
                    onClick={() => removeVideoField(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    <AiOutlineMinus />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addVideoField}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded"
              >
                <AiOutlinePlus /> Add Video
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
