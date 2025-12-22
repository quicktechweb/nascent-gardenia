"use client";
import { useEffect, useState } from "react";
import axios from "axios";

/* ================= Image Upload ================= */
const uploadToImgbb = async (file: File) => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await axios.post(
    "https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c",
    fd
  );

  return res.data.data.url as string;
};

/* ================= Types ================= */
type TeamMember = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
};

/* ================= Component ================= */
export default function AboutUsAdmin() {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const [form, setForm] = useState<{
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    propertyTitle: string;
    propertyDesc1: string;
    propertyDesc2: string;
    propertyImage: string;
    mission: string;
    vision: string;
    teamMembers: TeamMember[];
  }>({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    propertyTitle: "",
    propertyDesc1: "",
    propertyDesc2: "",
    propertyImage: "",
    mission: "",
    vision: "",
    teamMembers: [],
  });

  /* ================= Fetch Data ================= */
  useEffect(() => {
    axios.get("https://nascent.virtualshopbd.com/api/about-us").then((res) => {
      if (res.data) setForm(res.data);
    });
  }, []);

  /* ================= Basic Change ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= Image Upload Handlers ================= */
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "heroImage" | "propertyImage"
  ) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const url = await uploadToImgbb(e.target.files[0]);
    setForm({ ...form, [field]: url });
    setLoading(false);
  };

  const handleTeamImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const url = await uploadToImgbb(e.target.files[0]);
    const updated = [...form.teamMembers];
    updated[index].image = url;
    setForm({ ...form, teamMembers: updated });
    setLoading(false);
  };

  /* ================= Team Handlers ================= */
  const handleTeamChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updated = [...form.teamMembers];
    updated[index][field] = value;
    setForm({ ...form, teamMembers: updated });
  };

  const addTeamMember = () => {
    setForm({
      ...form,
      teamMembers: [
        ...form.teamMembers,
        { name: "", role: "", image: "", linkedin: "" },
      ],
    });
  };

  const removeTeamMember = (index: number) => {
    setForm({
      ...form,
      teamMembers: form.teamMembers.filter((_, i) => i !== index),
    });
  };

  const saveData = async () => {
    await axios.post("https://nascent.virtualshopbd.com/api/about-us", form);
    alert("Saved successfully");
    setEditMode(false);
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 text-black">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header + Edit Button */}
        <div className="bg-white rounded-2xl shadow p-8 border flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold">About Us Management</h1>
            <p className="text-gray-500 mt-2">
              {editMode ? "Editing mode" : "Preview mode"}
            </p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-xl font-semibold"
          >
            {editMode ? "Preview" : "Edit"}
          </button>
        </div>

        {/* Hero Section */}
        <Section title="Hero Section">
          {editMode ? (
            <>
              <Input
                label="Hero Title"
                name="heroTitle"
                value={form.heroTitle}
                onChange={handleChange}
              />
              <Input
                label="Hero Subtitle"
                name="heroSubtitle"
                value={form.heroSubtitle}
                onChange={handleChange}
              />
              <FileInput
                label="Hero Image"
                image={form.heroImage}
                onChange={(e) => handleImageUpload(e, "heroImage")}
              />
            </>
          ) : (
            <Preview
              data={{
                Title: form.heroTitle,
                Subtitle: form.heroSubtitle,
                Image: form.heroImage,
              }}
            />
          )}
        </Section>

        {/* Property Section */}
        <Section title="Property Section">
          {editMode ? (
            <>
              <Input
                label="Property Title"
                name="propertyTitle"
                value={form.propertyTitle}
                onChange={handleChange}
              />
              <Textarea
                label="Property Description (1)"
                name="propertyDesc1"
                value={form.propertyDesc1}
                onChange={handleChange}
              />
              <Textarea
                label="Property Description (2)"
                name="propertyDesc2"
                value={form.propertyDesc2}
                onChange={handleChange}
              />
              <FileInput
                label="Property Image"
                image={form.propertyImage}
                onChange={(e) => handleImageUpload(e, "propertyImage")}
              />
            </>
          ) : (
            <Preview
              data={{
                "Title": form.propertyTitle,
                "Description 1": form.propertyDesc1,
                "Description 2": form.propertyDesc2,
                "Image": form.propertyImage,
              }}
            />
          )}
        </Section>

        {/* Mission & Vision */}
        <Section title="Mission & Vision">
          {editMode ? (
            <>
              <Textarea
                label="Mission"
                name="mission"
                value={form.mission}
                onChange={handleChange}
              />
              <Textarea
                label="Vision"
                name="vision"
                value={form.vision}
                onChange={handleChange}
              />
            </>
          ) : (
            <Preview
              data={{
                Mission: form.mission,
                Vision: form.vision,
              }}
            />
          )}
        </Section>

        {/* Team Members */}
        <Section title="Team Members">
          {editMode ? (
            <div className="md:col-span-2 space-y-6">
              {form.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="relative bg-gray-50 border rounded-2xl p-6 space-y-4"
                >
                  <button
                    onClick={() => removeTeamMember(index)}
                    className="absolute top-4 right-4 text-red-500 font-semibold"
                  >
                    Remove
                  </button>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      value={member.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTeamChange(index, "name", e.target.value)
                      }
                    />
                    <Input
                      label="Role"
                      value={member.role}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTeamChange(index, "role", e.target.value)
                      }
                    />
                    <Input
                      label="LinkedIn"
                      value={member.linkedin}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTeamChange(index, "linkedin", e.target.value)
                      }
                    />
                  </div>

                  <FileInput
                    label="Profile Image"
                    image={member.image}
                    onChange={(e) => handleTeamImageUpload(e, index)}
                  />
                </div>
              ))}

              <button
                onClick={addTeamMember}
                className="w-full py-4 border-2 border-dashed border-yellow-400 text-yellow-600 rounded-xl font-semibold hover:bg-yellow-50"
              >
                + Add Team Member
              </button>
            </div>
          ) : (
            <div className="md:col-span-2 space-y-6">
              {form.teamMembers.map((member, index) => (
                <Preview
                  key={index}
                  data={{
                    Name: member.name,
                    Role: member.role,
                    LinkedIn: member.linkedin,
                    Image: member.image,
                  }}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Save */}
        {editMode && (
          <div className="flex justify-end">
            <button
              onClick={saveData}
              disabled={loading}
              className="bg-gray-900 text-white px-12 py-4 rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= Reusable UI ================= */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-8 border space-y-6">
      <h2 className="text-2xl font-bold border-l-4 border-yellow-400 pl-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <input {...props} className="w-full rounded-xl border px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-yellow-400" />
    </div>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-semibold">{label}</label>
      <textarea {...props} rows={4} className="w-full rounded-xl border px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-yellow-400 resize-none" />
    </div>
  );
}

function FileInput({ label, image, onChange }: { label: string; image: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-3 md:col-span-2">
      <label className="text-sm font-semibold">{label}</label>
      <input type="file" accept="image/*" onChange={onChange} />
      {image && <img src={image} alt="preview" className="w-40 h-28 object-cover rounded-xl border" />}
    </div>
  );
}

function Preview({ data }: { data: Record<string, string> }) {
  return (
    <div className="md:col-span-2 bg-gray-50 border rounded-xl p-4 space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col md:flex-row md:items-center gap-2">
          <span className="font-semibold w-32">{key}:</span>
          {key.toLowerCase().includes("image") && value ? (
            <img src={value} alt={key} className="w-40 h-28 object-cover rounded-md border" />
          ) : (
            <span>{value || "-"}</span>
          )}
        </div>
      ))}
    </div>
  );
}
