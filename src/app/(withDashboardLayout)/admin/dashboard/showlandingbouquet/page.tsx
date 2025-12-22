"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

type Room = {
  _id: string;
  title: string;
  description: string;
  bigImage: string;
  smallImage: string;
};

export default function Showlandingbouquet() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bigImageFile, setBigImageFile] = useState<File | null>(null);
  const [smallImageFile, setSmallImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch rooms
  const fetchRooms = async () => {
    const res = await axios.get<Room[]>(
      "https://nascent.virtualshopbd.com/api/landingbouquet/add"
    );
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ImgBB upload
  const uploadToImgbb = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
      fd
    );
    return res.data.data.url;
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setTitle(room.title);
    setDescription(room.description);
    setBigImageFile(null);
    setSmallImageFile(null);
  };

  const handleUpdate = async () => {
    if (!editingRoom) return;

    setUploading(true);

    try {
      let bigImageUrl = editingRoom.bigImage;
      let smallImageUrl = editingRoom.smallImage;

      if (bigImageFile) bigImageUrl = await uploadToImgbb(bigImageFile);
      if (smallImageFile) smallImageUrl = await uploadToImgbb(smallImageFile);

      await axios.put(
        `https://nascent.virtualshopbd.com/api/landingbouquet/edit/${editingRoom._id}`,
        {
          title,
          description,
          bigImage: bigImageUrl,
          smallImage: smallImageUrl,
        }
      );

      alert("Room updated successfully!");
      setEditingRoom(null);
      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Failed to update room!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">Rooms Manager</h1>

      {/* Rooms Table */}
      <div className="overflow-x-auto">
    <table className="w-full table-fixed bg-white rounded-xl shadow-lg overflow-hidden text-black">
  <thead>
    <tr className="bg-gradient-to-r from-[#c78436] to-[#a6712e] text-sm uppercase tracking-wide text-white">
      <th className="p-4 text-left w-[15%]">Title</th>
      <th className="p-4 text-left w-[30%]">Description</th>
      <th className="p-4 text-center w-[15%]">Big Image</th>
      <th className="p-4 text-center w-[15%]">Small Image</th>
      <th className="p-4 text-center w-[10%]">Actions</th>
    </tr>
  </thead>

  <tbody>
    {rooms.map((room) => (
      <tr
        key={room._id}
        className="border-b last:border-none hover:bg-gray-50 transition"
      >
        {/* TITLE */}
        <td className="p-4 font-medium text-gray-800">
          {room.title}
        </td>

        {/* DESCRIPTION (short + professional) */}
        <td className="p-4 text-gray-600 text-sm">
          <p className="max-w-[320px] line-clamp-2">
            {room.description}
          </p>
        </td>

        {/* BIG IMAGE */}
        <td className="p-4">
          <div className="relative w-24 h-16 mx-auto rounded-md overflow-hidden border">
            <Image
              src={room.bigImage}
              alt={room.title}
              fill
              className="object-cover"
            />
          </div>
        </td>

        {/* SMALL IMAGE */}
        <td className="p-4">
          <div className="relative w-20 h-14 mx-auto rounded-md overflow-hidden border">
            <Image
              src={room.smallImage}
              alt={room.title}
              fill
              className="object-cover"
            />
          </div>
        </td>

        {/* ACTION */}
        <td className="p-4 text-center">
          <button
            onClick={() => openEditModal(room)}
            className="bg-gradient-to-r from-[#c78436] to-[#a6712e] hover:bg-[#a8923f] px-4 py-1.5 rounded-md text-white text-sm font-semibold transition"
          >
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-lg text-black relative">
            <h2 className="text-2xl font-bold mb-4">Edit Room</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded w-full mb-4 resize-none h-24"
            />

            <label className="block mb-2 font-semibold">Big Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBigImageFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            {bigImageFile && (
              <div className="mb-4 w-full h-40 relative">
                <Image
                  src={URL.createObjectURL(bigImageFile)}
                  alt="Big Preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <label className="block mb-2 font-semibold">Small Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSmallImageFile(e.target.files?.[0] || null)}
              className="mb-4"
            />
            {smallImageFile && (
              <div className="mb-4 w-full h-24 relative">
                <Image
                  src={URL.createObjectURL(smallImageFile)}
                  alt="Small Preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 rounded-md border border-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-md bg-[#bea64c] text-black font-semibold"
                disabled={uploading}
              >
                {uploading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
