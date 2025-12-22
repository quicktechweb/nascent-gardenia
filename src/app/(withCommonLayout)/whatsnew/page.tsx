"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";

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

export default function WhatsNewPremium() {
  const [data, setData] = useState<WhatsNewData>({
    notices: [],
    faqs: [],
    blogs: [],
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  // Fetch data from API
  useEffect(() => {
    axios
      .get<WhatsNewData>("https://nascent.virtualshopbd.com/api/whats-new")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching WhatsNew data:", err));
  }, []);

  return (
    <section className="mx-auto px-5 py-24 space-y-32 bg-white">

      {/* Hotel Notices */}
      <div className="max-w-7xl mx-auto mt-8">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">
          Hotel Notices
        </h2>
        <div className="grid md:grid-cols-3 gap-10 justify-center">
          {data.notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-gradient-to-tr from-yellow-50 to-yellow-100 p-6 rounded-3xl shadow-2xl transform transition duration-500 hover:-translate-y-4 hover:shadow-3xl"
            >
              <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                Notice
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{notice.title}</h3>
              <p className="text-gray-600 text-sm">{notice.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-7xl mx-auto space-y-4">
          {data.faqs.map((faq) => (
            <div key={faq.id} className="bg-gray-50 rounded-3xl shadow-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex justify-between items-center p-6 focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUpIcon className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
              {openFaq === faq.id && (
                <div className="px-6 pb-6 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blog Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">
          Latest Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 justify-items-center text-center">
          {data.blogs.map((blog) => (
            <div
              key={blog.id}
              className="relative w-[320px] bg-white rounded-3xl shadow-2xl overflow-hidden transform transition duration-500 hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] group"
            >
              {/* Image */}
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-gray-500 text-sm">{blog.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
