"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

/* ---------------- Types ---------------- */

interface FutureConnect {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  nidFront: string[];
  nidBack: string[];
  passport: string[];
  createdAt?: string;
}

/* ---------------- Page ---------------- */

export default function FutureConnectAdminPage() {
  const [data, setData] = useState<FutureConnect[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<FutureConnect[]>("https://nascent.virtualshopbd.com/api/futurecontact/all")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600 text-lg">
        Loading data...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Future Connect Submissions
      </h1>

      {/* -------- Table -------- */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">NID Images</th>
              <th className="px-4 py-3">Passport</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3 capitalize">{item.country}</td>

                <td className="px-4 py-3">
                  <ImageGroup
                    images={item.nidFront}
                    onPreview={setPreviewImage}
                  />
                </td>

                <td className="px-4 py-3">
                  <ImageGroup
                    images={item.passport}
                    onPreview={setPreviewImage}
                  />
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------- Image Preview Modal -------- */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl font-bold"
            >
              ✕
            </button>

            <div className="relative w-full h-[75vh] bg-white rounded-xl overflow-hidden shadow-lg">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Image Group ---------------- */

function ImageGroup({
  images,
  onPreview,
}: {
  images: string[];
  onPreview: (img: string) => void;
}) {
  if (!images || images.length === 0) {
    return <span className="text-gray-400">No Image</span>;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {images
        .filter(Boolean)
        .map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onPreview(img)}
            className="relative w-12 h-12 rounded-lg overflow-hidden border hover:scale-105 transition"
          >
            <Image
              src={img}
              alt="document"
              fill
              className="object-cover"
            />
          </button>
        ))}
    </div>
  );
}
