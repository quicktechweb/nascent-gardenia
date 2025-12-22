"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEdit, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

type Room = {
  _id: string;
  title?: string;
  description?: string;
  features: string[];
};

type UpdateRoomData = {
  title?: string;
  description?: string;
  features?: string[];
};

export default function RoomInfoSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: [] as string[],
  });

  // 🔹 Fetch data
  const fetchRooms = async () => {
    const res = await axios.get("https://nascent.virtualshopbd.com/api/features");
    setRooms(res.data.rooms || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔹 Open modal
  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      title: room.title || "",
      description: room.description || "",
      features: [...room.features],
    });
    setShowModal(true);
  };

  // 🔹 Handle feature change
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({ ...formData, features: updatedFeatures });
  };

  // 🔹 Add new feature field
  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  // 🔹 Remove feature field
  const removeFeatureField = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({ ...formData, features: updatedFeatures });
  };

  // 🔹 Update room (partial update)
const handleUpdate = async () => {
  if (!selectedRoom) return;

  const updatedData: UpdateRoomData = {};

  if (formData.title !== selectedRoom.title) updatedData.title = formData.title;
  if (formData.description !== selectedRoom.description)
    updatedData.description = formData.description;

  if (JSON.stringify(formData.features) !== JSON.stringify(selectedRoom.features)) {
    updatedData.features = formData.features.filter((f) => f.trim() !== "");
  }

  if (Object.keys(updatedData).length === 0) {
    alert("No changes detected");
    return;
  }

  try {
    await axios.put(
      `https://nascent.virtualshopbd.com/api/features/edit/${selectedRoom._id}`,
      updatedData
    );
    await fetchRooms();
    setShowModal(false);
    alert("Room updated successfully ✅");
  } catch (error) {
    console.error(error);
    alert("Update failed ❌");
  }
};


  if (loading) return <section className="p-10 text-center">Loading...</section>;

  return (
    <section className="p-10 bg-white min-h-screen">
      {/* ================= TABLE ================= */}
     <div className="overflow-x-auto border rounded-xl shadow-md bg-white">
  <table className="w-full border-collapse text-gray-700">
    <thead className="bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white">
      <tr>
        <th className="border-b px-6 py-3 text-left font-semibold ">Title</th>
        <th className="border-b px-6 py-3 text-left font-semibold ">Description</th>
        <th className="border-b px-6 py-3 text-left font-semibold">Features</th>
        <th className="border-b px-6 py-3 text-center font-semibold">Action</th>
      </tr>
    </thead>
    <tbody>
      {rooms.map((room) => (
        <tr key={room._id} className="hover:bg-gray-50 transition-colors">
          <td className=" px-6 py-4 font-medium">{room.title}</td>
          <td className=" px-6 py-4 text-sm text-gray-600">{room.description}</td>
          <td className=" px-6 py-4 text-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1">
              {room.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </td>
          <td className=" px-6 py-4 text-center">
            <button
              onClick={() => openEditModal(room)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-[#c78436] to-[#a6712e] font-medium  border-gray-300 rounded-md hover:bg-[#007cde] hover:text-white transition text-white"
            >
              <AiOutlineEdit className="text-base" /> Edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-black">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Edit Room Info</h3>

            {/* TITLE */}
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title"
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            {/* DESCRIPTION */}
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Description"
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            {/* FEATURES */}
            <div className="mb-3">
              <label className="font-semibold mb-1 block">Features</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureField(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    <AiOutlineMinus />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded"
              >
                <AiOutlinePlus /> Add Feature
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
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}
    </section>
  );
}
