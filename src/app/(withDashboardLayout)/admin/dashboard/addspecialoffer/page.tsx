"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

type Offer = {
  _id?: string;
  title: string;
  subtitle: string;
  desc: string;
  button: string;
  image: string;
};

export default function SpecialOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState<Offer>({
    title: "",
    subtitle: "",
    desc: "",
    button: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUploadedImage, setLastUploadedImage] = useState<string>("");

  // 🔥 FILE INPUT REF (important)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ================= FETCH OFFERS =================
  const fetchOffers = async () => {
    try {
      const res = await axios.get<Offer[]>(
        "https://nascent.virtualshopbd.com/api/specialoffer"
      );
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ================= UPLOAD IMAGE TO IMGBB =================
  const uploadToImgbb = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
      fd
    );

    return res.data.data.url;
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.subtitle || !form.desc || !form.button) {
      alert("All fields required");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = form.image;

      if (file) {
        imageUrl = await uploadToImgbb(file);
      } else if (!imageUrl) {
        alert("Please select an image");
        setLoading(false);
        return;
      }

      await axios.post("https://nascent.virtualshopbd.com/api/specialoffer/add", {
        ...form,
        image: imageUrl,
      });

      // 🔥 FULL RESET (ALL FIELDS)
      setForm({
        title: "",
        subtitle: "",
        desc: "",
        button: "",
        image: "",
      });
      setFile(null);
      setLastUploadedImage(""); // clear preview

      // 🔥 CLEAR FILE INPUT MANUALLY
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Special Offers Manager
      </h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          rows={3}
        />

        <input
          type="text"
          placeholder="Button Text"
          value={form.button}
          onChange={(e) => setForm({ ...form, button: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        {/* IMAGE UPLOAD */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          className="w-full border px-3 py-2 rounded"
        />

        {/* IMAGE PREVIEW */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Offer"}
        </button>
      </form>
    </div>
  );
}
