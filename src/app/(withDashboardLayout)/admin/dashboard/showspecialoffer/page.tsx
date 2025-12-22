"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type Offer = {
  _id: string;
  title: string;
  subtitle: string;
  desc: string;
  button: string;
  image: string;
};

// ================= IMGBB UPLOAD =================
const uploadToImgbb = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await axios.post(
    "https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c",
    fd
  );

  return res.data.data.url;
};

export default function SpecialOfferTable() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [deleteOffer, setDeleteOffer] = useState<Offer | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ================= FETCH =================
  const fetchOffers = async () => {
    const res = await axios.get<Offer[]>(
      "https://nascent.virtualshopbd.com/api/specialoffer"
    );
    setOffers(res.data);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!editOffer) return;
    setLoading(true);

    try {
      await axios.put(
        `https://nascent.virtualshopbd.com/api/specialoffer/${editOffer._id}`,
        editOffer
      );
      setEditOffer(null);
      setEditFile(null);
      fetchOffers();
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE UPLOAD =================
  const handleEditImageUpload = async () => {
    if (!editFile || !editOffer) return;

    setUploading(true);
    try {
      const url = await uploadToImgbb(editFile);
      setEditOffer({ ...editOffer, image: url });
      setEditFile(null);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!deleteOffer) return;
    setLoading(true);

    try {
      await axios.delete(
        `https://nascent.virtualshopbd.com/api/specialoffer/${deleteOffer._id}`
      );
      setDeleteOffer(null);
      fetchOffers();
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Special Offers Manager
      </h1>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-100 text-sm uppercase text-gray-600">
            <tr>
              <th className="p-4 w-[14%] text-left">Title</th>
              <th className="p-4 w-[18%] text-left">Subtitle</th>
              <th className="p-4 w-[25%] text-left">Description</th>
              <th className="p-4 w-[10%] text-left">Button</th>
              <th className="p-4 w-[15%] text-center">Image</th>
              <th className="p-4 w-[18%] text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {offers.map((offer) => (
              <tr
                key={offer._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4 font-medium">{offer.title}</td>
                <td className="p-4">{offer.subtitle}</td>
                <td className="p-4 text-sm text-gray-600">
                  <p className="line-clamp-2 max-w-[320px]">
                    {offer.desc}
                  </p>
                </td>
                <td className="p-4">{offer.button}</td>
                <td className="p-4">
                  <div className="relative w-24 h-16 mx-auto rounded overflow-hidden border">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => setEditOffer(offer)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteOffer(offer)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Edit Offer</h2>

            <input
              value={editOffer.title}
              onChange={(e) =>
                setEditOffer({ ...editOffer, title: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <input
              value={editOffer.subtitle}
              onChange={(e) =>
                setEditOffer({ ...editOffer, subtitle: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              rows={3}
              value={editOffer.desc}
              onChange={(e) =>
                setEditOffer({ ...editOffer, desc: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <input
              value={editOffer.button}
              onChange={(e) =>
                setEditOffer({ ...editOffer, button: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />

            {/* IMAGE */}
            <div>
              <div className="relative w-full h-40 rounded overflow-hidden border mb-2">
                <Image
                  src={editOffer.image}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setEditFile(e.target.files[0])
                }
                className="w-full border px-3 py-2 rounded"
              />

              {editFile && (
                <button
                  type="button"
                  onClick={handleEditImageUpload}
                  disabled={uploading}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded text-sm"
                >
                  {uploading ? "Uploading..." : "Upload New Image"}
                </button>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditOffer(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-yellow-500 px-4 py-2 rounded font-semibold"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2 text-red-600">
              Delete Offer?
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete
              <span className="font-semibold"> {deleteOffer.title}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteOffer(null)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
