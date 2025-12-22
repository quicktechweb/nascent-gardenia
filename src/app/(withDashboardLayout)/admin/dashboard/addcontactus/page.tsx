"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";

interface ContactData {
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    weixin: string;
    youtube: string;
  };
}

export default function ContactUsAdmin() {
  const [data, setData] = useState<ContactData>({
    phone: "+880 1841 001112",
    email: "sales@nascenthotels.com",
    address: "27 Park Road, Baridhara Diplomatic Zone, Dhaka-1212",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      weixin: "#",
      youtube: "#",
    },
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // <-- Add edit mode state

  // Fetch existing data from API on mount
  useEffect(() => {
    axios
      .get<ContactData>("https://nascent.virtualshopbd.com/api/contact-data")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: ChangeEvent<HTMLInputElement>, platform: keyof ContactData["socialLinks"]) => {
    setData({
      ...data,
      socialLinks: {
        ...data.socialLinks,
        [platform]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://nascent.virtualshopbd.com/api/contact-data", data);
      alert("Contact data saved successfully!");
      setEditMode(false); // turn off edit mode after saving
    } catch (err) {
      console.error(err);
      alert("Error saving contact data.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 text-black rounded-3xl shadow-xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-6">Contact Section</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold"
        >
          {editMode ? "Cancel Edit" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div>
          <label className="font-semibold">Phone</label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl mt-1"
            readOnly={!editMode}
          />
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <input
            type="text"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl mt-1"
            readOnly={!editMode}
          />
        </div>
        <div>
          <label className="font-semibold">Address</label>
          <textarea
            name="address"
            value={data.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl mt-1"
            readOnly={!editMode}
          />
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-2">Social Media Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Facebook URL"
              value={data.socialLinks.facebook}
              onChange={(e) => handleSocialChange(e, "facebook")}
              className="p-3 border rounded-xl"
              readOnly={!editMode}
            />
            <input
              type="text"
              placeholder="Instagram URL"
              value={data.socialLinks.instagram}
              onChange={(e) => handleSocialChange(e, "instagram")}
              className="p-3 border rounded-xl"
              readOnly={!editMode}
            />
            <input
              type="text"
              placeholder="Weixin URL"
              value={data.socialLinks.weixin}
              onChange={(e) => handleSocialChange(e, "weixin")}
              className="p-3 border rounded-xl"
              readOnly={!editMode}
            />
            <input
              type="text"
              placeholder="YouTube URL"
              value={data.socialLinks.youtube}
              onChange={(e) => handleSocialChange(e, "youtube")}
              className="p-3 border rounded-xl"
              readOnly={!editMode}
            />
          </div>
        </div>

        {editMode && (
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform duration-300"
          >
            {loading ? "Saving..." : "Save Contact Data"}
          </button>
        )}
      </form>
    </div>
  );
}
