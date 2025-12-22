"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface SocialLinks {
  facebook: string;
  instagram: string;
  wechat: string;
  youtube: string;
}

interface ContactInfo {
  address: string;
  googleMapLink: string;
  email: string;
  salesPhone: string;
  frontOfficePhone: string;
}

interface FooterData {
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
}

type FooterSection = "socialLinks" | "contactInfo";

export default function AdminFooterForm() {
  const [footerData, setFooterData] = useState<FooterData>({
    socialLinks: { facebook: "", instagram: "", wechat: "", youtube: "" },
    contactInfo: {
      address: "",
      googleMapLink: "",
      email: "",
      salesPhone: "",
      frontOfficePhone: "",
    },
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFooter();
  }, []);

  const fetchFooter = async () => {
    try {
      const res = await axios.get("https://nascent.virtualshopbd.com/api/footer");
      if (res.data.success && res.data.footer) {
        setFooterData(res.data.footer);
      }
    } catch (err) {
      console.error("Fetch footer error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, key] = name.split(".") as [FooterSection, string];

  setFooterData(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [key as keyof typeof prev[typeof section]]: value,
    },
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://nascent.virtualshopbd.com/api/footer", footerData);
      if (res.data.success) {
        setMessage("✅ Footer updated successfully!");
      }
    } catch (err) {
      console.error("Update footer error:", err);
      setMessage("❌ Failed to update footer");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10 text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Footer Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          {Object.keys(footerData.socialLinks).map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              <input
                type="text"
                name={`socialLinks.${key}`}
                placeholder={`Enter ${key} URL`}
                value={footerData.socialLinks[key as keyof SocialLinks]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
          {Object.keys(footerData.contactInfo).map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")} {/* camelCase to readable */}
              </label>
              <input
                type="text"
                name={`contactInfo.${key}`}
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                value={footerData.contactInfo[key as keyof ContactInfo]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Save Footer
        </button>

        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
}
