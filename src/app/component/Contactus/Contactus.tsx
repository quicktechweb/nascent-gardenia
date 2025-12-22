"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactUsSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    // TODO: add API call or email logic here
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-gray-900 text-white py-20 px-5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-yellow-400">Contact Us</h2>
          <p className="text-gray-300">
            We  love to hear from you! Reach out for inquiries, support, or
            just to say hi.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">
              <HiOutlinePhone className="text-yellow-400 w-6 h-6" />
              <span>+880 1841 001112</span>
            </div>
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">
              <HiOutlineMail className="text-yellow-400 w-6 h-6" />
              <span>support@luckyshop.com</span>
            </div>
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition">
              <HiOutlineLocationMarker className="text-yellow-400 w-6 h-6" />
              <span>Baridhara, Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 focus:border-yellow-400 outline-none transition"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 focus:border-yellow-400 outline-none transition"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 focus:border-yellow-400 outline-none transition resize-none h-32"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
