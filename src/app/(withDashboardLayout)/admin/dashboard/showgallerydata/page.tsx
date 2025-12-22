"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Plus, Trash2, Upload, Edit2 } from "lucide-react";

type GalleryItem = {
  _id: string;
  title: string;
  caption: string;
  src: string;
  badge?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  title: string;
  caption: string;
  src: string;
  badge: string;
  tags: string[];
};

export default function PremiumGalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<FormState>({
    title: "",
    caption: "",
    src: "",
    badge: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // MODAL STATE

  const API_BASE = "https://nascent.virtualshopbd.com/api";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE}/premium-gallery`);
      if (res.data?.success) setItems(res.data.data);
    } catch (err) {
      console.error("Fetch items error", err);
      alert("Failed to load gallery items");
    }
  };

  // ImgBB upload
  const uploadToImgbb = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const key = "ab454291ebee91b49b021ecac51be17c";
    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${key}`, fd);
    return res.data.data.url as string;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const url = await uploadToImgbb(file);
      setForm((f) => ({ ...f, src: url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;

    if (!form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const ensureLastTag = (currForm: FormState) => {
    if (tagInput.trim()) {
      const t = tagInput.trim();
      if (!currForm.tags.includes(t)) {
        return { ...currForm, tags: [...currForm.tags, t] };
      }
    }
    return currForm;
  };

  const resetForm = () => {
    setForm({ title: "", caption: "", src: "", badge: "", tags: [] });
    setTagInput("");
    setIsEditing(false);
    setEditId(null);
    setShowModal(false); // CLOSE MODAL
  };

  const handleSubmit = async () => {
    const prepared = ensureLastTag(form);

    if (!prepared.title || !prepared.caption || !prepared.src) {
      return alert("Please fill required fields: title, caption and image");
    }

    try {
      if (isEditing && editId) {
        const res = await axios.put(`${API_BASE}/premium-gallery/${editId}`, prepared);
        if (res.data?.success) {
          alert("Updated successfully");
          await fetchItems();
          resetForm();
        }
      } else {
        const res = await axios.post(`${API_BASE}/premium-gallery`, prepared);
        if (res.data?.success) {
          alert("Created successfully");
          await fetchItems();
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      caption: item.caption,
      src: item.src,
      badge: item.badge || "",
      tags: item.tags || [],
    });
    setIsEditing(true);
    setEditId(item._id);
    setTagInput("");
    setShowModal(true); // OPEN MODAL
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/premium-gallery/${id}`);
      if (res.data?.success) {
        setItems((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ADD NEW FORM */}
     

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white text-black p-4 rounded-lg shadow flex gap-4">
              <div className="w-28 h-28 relative rounded overflow-hidden border">
                <Image src={item.src} alt={item.title} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-black">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.caption}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 border rounded flex items-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1.5 border rounded flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== EDIT MODAL ===================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-black">Edit Dish</h2>

            {/* TITLE */}
            <label className="block text-sm font-semibold mb-1 text-black">Dish Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 mb-3 text-black"
            />

            {/* CAPTION */}
            <label className="block text-sm font-semibold mb-1 text-black">Caption *</label>
            <input
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 mb-3 text-black"
            />

            {/* BADGE */}
            <label className="block text-sm font-semibold mb-1 text-black">Badge</label>
            <select
              value={form.badge}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 mb-3 text-black"
            >
              <option value="">Select</option>
              <option>Chef’s Choice</option>
              <option>Popular</option>
              <option>New</option>
              <option>Top Rated</option>
            </select>

            {/* TAGS */}
            <label className="block text-sm font-semibold mb-1 text-black">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 border rounded-lg px-3 py-2 bg-gray-50 text-black"
                placeholder="Add tag"
              />
              <button onClick={addTag} className="px-4 py-2 bg-black text-white rounded">
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((t) => (
                <span key={t} className="bg-black text-white px-3 py-1 rounded-full text-sm flex gap-1">
                  {t}
                  <button onClick={() => removeTag(t)}>
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>

            {/* IMAGE PREVIEW */}
            {form.src && (
              <div className="w-full h-40 relative rounded mb-4 overflow-hidden border">
                <Image src={form.src} alt="edit-img" fill className="object-cover" />
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={resetForm} className="px-5 py-2 rounded-lg border text-black">
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
