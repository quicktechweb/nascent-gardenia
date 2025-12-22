"use client";

import { useState, useEffect } from "react";
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
type Notice = {
  id: number;
  title: string;
  date: string;
};

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

type Blog = {
  id: number;
  title: string;
  date: string;
  image: string;
};

type WhatsNewData = {
  notices: Notice[];
  faqs: FAQ[];
  blogs: Blog[];
};

/* Editable fields for type safety */
type NoticeEditableField = "title" | "date";
type FAQEditableField = "question" | "answer";
type BlogEditableField = "title" | "date" | "image";

export default function WhatsNewPremiumAdmin() {
  const [data, setData] = useState<WhatsNewData>({
    notices: [],
    faqs: [],
    blogs: [],
  });
  const [loading, setLoading] = useState(false);

  // Edit mode state
  const [editMode, setEditMode] = useState({
    notices: false,
    faqs: false,
    blogs: false,
  });

  /* ================= Fetch Data ================= */
  useEffect(() => {
    axios
      .get<WhatsNewData>("https://nascent.virtualshopbd.com/api/whats-new")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* ================= Input Handlers ================= */
  const handleNoticeChange = (
    index: number,
    field: NoticeEditableField,
    value: string
  ) => {
    const updated = [...data.notices];
    updated[index][field] = value;
    setData({ ...data, notices: updated });
  };

  const handleFAQChange = (
    index: number,
    field: FAQEditableField,
    value: string
  ) => {
    const updated = [...data.faqs];
    updated[index][field] = value;
    setData({ ...data, faqs: updated });
  };

  const handleBlogChange = (
    index: number,
    field: BlogEditableField,
    value: string
  ) => {
    const updated = [...data.blogs];
    updated[index][field] = value;
    setData({ ...data, blogs: updated });
  };

  const handleBlogImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const url = await uploadToImgbb(e.target.files[0]);
    handleBlogChange(index, "image", url);
    setLoading(false);
  };

  /* ================= Add / Remove Items ================= */
  const addNotice = () =>
    setData({
      ...data,
      notices: [...data.notices, { id: Date.now(), title: "", date: "" }],
    });
  const removeNotice = (index: number) =>
    setData({
      ...data,
      notices: data.notices.filter((_, i) => i !== index),
    });

  const addFAQ = () =>
    setData({
      ...data,
      faqs: [...data.faqs, { id: Date.now(), question: "", answer: "" }],
    });
  const removeFAQ = (index: number) =>
    setData({
      ...data,
      faqs: data.faqs.filter((_, i) => i !== index),
    });

  const addBlog = () =>
    setData({
      ...data,
      blogs: [...data.blogs, { id: Date.now(), title: "", date: "", image: "" }],
    });
  const removeBlog = (index: number) =>
    setData({
      ...data,
      blogs: data.blogs.filter((_, i) => i !== index),
    });

  /* ================= Save Data ================= */
  const saveData = async () => {
    setLoading(true);
    try {
      await axios.post("https://nascent.virtualshopbd.com/api/whats-new", data);
      alert("Saved successfully!");
      setEditMode({ notices: false, faqs: false, blogs: false });
    } catch (err) {
      console.error(err);
      alert("Error saving data");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-5 text-black">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* Notices */}
        <section className="bg-white p-8 rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold border-l-4 border-yellow-400 pl-4">
              Hotel Notices
            </h2>
            <button
              onClick={() => setEditMode({ ...editMode, notices: !editMode.notices })}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold"
            >
              {editMode.notices ? "Cancel Edit" : "Edit"}
            </button>
          </div>

          {data.notices.map((notice, index) => (
            <div key={notice.id} className="flex gap-4 items-center">
              {editMode.notices ? (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    value={notice.title}
                    onChange={(e) => handleNoticeChange(index, "title", e.target.value)}
                    className="flex-1 p-3 rounded-xl border"
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={notice.date}
                    onChange={(e) => handleNoticeChange(index, "date", e.target.value)}
                    className="w-48 p-3 rounded-xl border"
                  />
                  <button onClick={() => removeNotice(index)} className="text-red-500 font-bold">
                    Remove
                  </button>
                </>
              ) : (
                <p className="flex-1">{notice.title} - {notice.date}</p>
              )}
            </div>
          ))}
          {editMode.notices && (
            <button
              onClick={addNotice}
              className="bg-yellow-400 text-white px-6 py-2 rounded-xl font-semibold"
            >
              + Add Notice
            </button>
          )}
        </section>

        {/* FAQs */}
        <section className="bg-white p-8 rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold border-l-4 border-yellow-400 pl-4">FAQs</h2>
            <button
              onClick={() => setEditMode({ ...editMode, faqs: !editMode.faqs })}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold"
            >
              {editMode.faqs ? "Cancel Edit" : "Edit"}
            </button>
          </div>

          {data.faqs.map((faq, index) => (
            <div key={faq.id} className="flex flex-col gap-3">
              {editMode.faqs ? (
                <>
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                    className="p-3 rounded-xl border"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                    className="p-3 rounded-xl border"
                  />
                  <button
                    onClick={() => removeFAQ(index)}
                    className="text-red-500 font-bold self-start"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <p>{faq.question} - {faq.answer}</p>
              )}
            </div>
          ))}
          {editMode.faqs && (
            <button
              onClick={addFAQ}
              className="bg-yellow-400 text-white px-6 py-2 rounded-xl font-semibold"
            >
              + Add FAQ
            </button>
          )}
        </section>

        {/* Blogs */}
        <section className="bg-white p-8 rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold border-l-4 border-yellow-400 pl-4">Blogs</h2>
            <button
              onClick={() => setEditMode({ ...editMode, blogs: !editMode.blogs })}
              className="bg-gray-900 text-white px-4 py-2 rounded-xl font-semibold"
            >
              {editMode.blogs ? "Cancel Edit" : "Edit"}
            </button>
          </div>

          {data.blogs.map((blog, index) => (
            <div key={blog.id} className="flex flex-col md:flex-row gap-4 items-center">
              {editMode.blogs ? (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    value={blog.title}
                    onChange={(e) => handleBlogChange(index, "title", e.target.value)}
                    className="flex-1 p-3 rounded-xl border"
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={blog.date}
                    onChange={(e) => handleBlogChange(index, "date", e.target.value)}
                    className="w-48 p-3 rounded-xl border"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBlogImageUpload(e, index)}
                    className="w-48"
                  />
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-32 h-20 object-cover rounded-xl"
                    />
                  )}
                  <button onClick={() => removeBlog(index)} className="text-red-500 font-bold">
                    Remove
                  </button>
                </>
              ) : (
                <p>{blog.title} - {blog.date}</p>
              )}
            </div>
          ))}
          {editMode.blogs && (
            <button
              onClick={addBlog}
              className="bg-yellow-400 text-white px-6 py-2 rounded-xl font-semibold"
            >
              + Add Blog
            </button>
          )}
        </section>

        {/* Save Button */}
        {(editMode.notices || editMode.faqs || editMode.blogs) && (
          <div className="flex justify-end">
            <button
              onClick={saveData}
              disabled={loading}
              className="bg-gray-900 text-white px-12 py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
