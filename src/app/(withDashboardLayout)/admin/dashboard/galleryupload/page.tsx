"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload } from "lucide-react";
import axios from "axios";

interface GalleryForm {
  title: string;
  caption: string;
  src: string;
  badge: string;
  tags: string[];
}

export default function PremiumGalleryForm() {
  const [form, setForm] = useState<GalleryForm>({
    title: "",
    caption: "",
    src: "",
    badge: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const url = await uploadToImgbb(file);
      setForm({ ...form, src: url });
    } catch (error) {
      console.error(error);
      alert("Image upload failed!");
    }

    setUploading(false);
  };

  // Add tag
  const addTag = () => {
    const newTag = tagInput.trim();
    if (!newTag) return;

    // Avoid duplicate tags
    setForm(prevForm => ({
      ...prevForm,
      tags: prevForm.tags.includes(newTag) ? prevForm.tags : [...prevForm.tags, newTag]
    }));

    setTagInput("");
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setForm(prevForm => ({
      ...prevForm,
      tags: prevForm.tags.filter(t => t !== tag)
    }));
  };

  // Submit form
 const handleSubmit = async () => {

  // Auto-add last typed tag if exists
  if (tagInput.trim()) {
    setForm(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
  }

  if (!form.title || !form.caption || !form.src) {
    return alert("Please fill all required fields!");
  }

  try {
    const payload = {
      ...form,
      tags: tagInput.trim()
        ? [...form.tags, tagInput.trim()]
        : form.tags
    };

    const res = await axios.post("https://nascent.virtualshopbd.com/api/premium-gallery", payload);

    alert("Uploaded successfully!");
    setForm({ title: "", caption: "", src: "", badge: "", tags: [] });
    setTagInput("");

  } catch (error) {
    console.error(error);
    alert("Failed to upload!");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-6 text-black">

        <h2 className="text-2xl font-bold mb-4 text-black">
          Add New Premium Gallery Item
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Dish Title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-black"
            placeholder="Example: Classic Pasta Bowl"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Caption *
          </label>
          <input
            name="caption"
            value={form.caption}
            onChange={handleInput}
            className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-black"
            placeholder="Example: Italian herbs with mushroom & cream"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Upload Image *
          </label>

          <label className="flex items-center gap-2 bg-black text-white w-fit px-4 py-2 rounded-lg cursor-pointer">
            <Upload size={18} /> Choose File
            <input type="file" onChange={handleImageUpload} className="hidden" />
          </label>

          {uploading && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}

          {form.src && (
            <div className="mt-4 w-full rounded-xl overflow-hidden shadow border bg-gray-200">
              <Image
                src={form.src}
                alt="Preview"
                width={600}
                height={400}
                className="object-cover w-full h-56"
              />
            </div>
          )}
        </div>

        {/* Badge */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Badge
          </label>
          <select
            name="badge"
            value={form.badge}
            onChange={handleInput}
            className="w-full border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-black"
          >
            <option value="">Select Badge</option>
            <option value="Chef’s Choice">Chef’s Choice</option>
            <option value="Popular">Popular</option>
            <option value="New">New</option>
            <option value="Top Rated">Top Rated</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-black mb-1">
            Tags
          </label>

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 bg-gray-50 shadow-sm text-black"
              placeholder="Add tag e.g. Lunch, Salad"
            />

            <button
              onClick={addTag}
              className="px-4 py-2 bg-black text-white rounded-lg shadow"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-full text-sm text-black"
              >
                {tag}
                <button onClick={() => removeTag(tag)}>
                  <Trash2 size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-black text-white rounded-xl font-semibold shadow hover:bg-gray-900"
        >
          Upload Dish
        </button>
      </div>
    </div>
  );
}
