"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

// Upload image to ImgBB
const uploadToImgbb = async (file: File) => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
    fd
  );

  return res.data.data.url;
};

export default function RoomSection() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bigImage, setBigImage] = useState<File | null>(null);
  const [smallImage, setSmallImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !bigImage || !smallImage) {
      return alert("Please fill all fields and select both images!");
    }

    setUploading(true);
    try {
      const bigImageUrl = await uploadToImgbb(bigImage);
      const smallImageUrl = await uploadToImgbb(smallImage);

      // Send data to backend
      await axios.post("https://nascent.virtualshopbd.com/api/landingroom/add", {
        title,
        description,
        bigImage: bigImageUrl,
        smallImage: smallImageUrl,
      });

      alert("Room saved successfully!");
      setTitle("");
      setDescription("");
      setBigImage(null);
      setSmallImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save room!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full bg-[#e8dfd9] py-20 relative overflow-hidden">
      {/* ===== FORM ===== */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md text-black">
        <h2 className="text-2xl font-bold mb-4">Add a New Room</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Room Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full mb-4 text-black"
        />

        {/* Description */}
        <textarea
          placeholder="Room Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full mb-4 resize-none h-24"
        />

        {/* Big Image */}
        <label className="block mb-2 font-semibold">Big Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBigImage(e.target.files?.[0] || null)}
          className="mb-4"
        />
        {bigImage && (
          <div className="mb-4 w-full h-64 relative">
            <Image
              src={URL.createObjectURL(bigImage)}
              alt="Big Image Preview"
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        {/* Small Image */}
        <label className="block mb-2 font-semibold">Small Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSmallImage(e.target.files?.[0] || null)}
          className="mb-4"
        />
        {smallImage && (
          <div className="mb-4 w-full h-40 relative">
            <Image
              src={URL.createObjectURL(smallImage)}
              alt="Small Image Preview"
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-[#bea64c] text-[#2d2926] px-5 py-2 rounded-md font-semibold"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Save Room"}
        </button>
      </div>
    </div>
  );
}

/* ===== MODERN GEOMETRIC SHAPE COMPONENT ===== */
function GeoPattern({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className="glow-stroke"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stopColor="#bea64c" />
          <stop offset="100%" stopColor="#2d2926" />
        </linearGradient>
      </defs>
      <polygon points="100,10 150,60 100,110 50,60" />
      <polygon points="100,90 150,140 100,190 50,140" />
      <polygon points="60,50 100,90 60,130 20,90" />
      <polygon points="140,50 180,90 140,130 100,90" />
      <polygon points="100,60 125,90 100,120 75,90" />
    </svg>
  );
}
