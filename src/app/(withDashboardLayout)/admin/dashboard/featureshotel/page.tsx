"use client";

import { useState } from "react";
import axios from "axios";
import { AiOutlineDoubleRight } from "react-icons/ai";

export default function RoomInfoSection() {
  const [formData, setFormData] = useState({
    // title: "",
    // description: "",
    features: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await axios.post("https://nascent.virtualshopbd.com/api/features/create", {
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });

    alert("Feature added ✅");
    setFormData({ features: "" });
  } catch (error) {
    console.error(error);
    alert("Failed ❌");
  }
};


  return (
    <section className="px-4 py-16 bg-[#0f3333]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* HEADER */}
        <h2
          className="text-[#c78436] text-4xl md:text-6xl font-semibold mb-14 text-center uppercase"
          style={{ fontFamily: "Trajan Pro, Cinzel, serif" }}
        >
          NASCENT GARDENIA BARIDHARA
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-xl p-8 space-y-6"
        >
          {/* TITLE */}
          {/* <div>
            <label className="text-white block mb-2">Room Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="A Spacious and Elegant"
              className="w-full px-4 py-3 rounded bg-[#0f3333] text-white border border-gray-600 focus:outline-none"
              required
            />
          </div> */}

          {/* DESCRIPTION */}
          {/* <div>
            <label className="text-white block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Room description..."
              className="w-full px-4 py-3 rounded bg-[#0f3333] text-white border border-gray-600 focus:outline-none"
              required
            />
          </div> */}

          {/* FEATURES */}
          <div>
            <label className="text-white block mb-2">
              Features (comma separated)
            </label>
            <input
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="King bed, Free WiFi, Breakfast"
              className="w-full px-4 py-3 rounded bg-[#0f3333] text-white border border-gray-600 focus:outline-none"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-[#c78436] text-black font-semibold py-3 rounded hover:bg-[#b8732d] transition"
          >
            Save Room Info
          </button>
        </form>
      </div>
    </section>
  );
}
