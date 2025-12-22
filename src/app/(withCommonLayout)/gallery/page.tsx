"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Search, UtensilsCrossed } from "lucide-react";
import axios from "axios";

export default function PremiumGallery() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lightboxRef = useRef<HTMLDivElement | null>(null);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("https://nascent.virtualshopbd.com/api/premium-gallery");
        setImages(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);

  // All unique tags
  const tags = useMemo(
    () => Array.from(new Set(images.flatMap((img: any) => img.tags || ["Untagged"]))),
    [images]
  );

  // Filtered images by search and tag
  const filtered = useMemo(() => {
    let list = images.slice();
    if (activeTag) list = list.filter((img: any) => (img.tags || []).includes(activeTag));
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(
      (img: any) =>
        img.title.toLowerCase().includes(q) ||
        img.caption.toLowerCase().includes(q)
    );
    return list;
  }, [query, activeTag, images]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const goNext = () => setLightboxIndex((s) => (s! + 1) % filtered.length);
  const goPrev = () => setLightboxIndex((s) => (s! - 1 + filtered.length) % filtered.length);

  if (loading) return <p className="text-center mt-10">Loading gallery...</p>;

  return (
    <div className="bg-[#e9e0d9] min-h-screen pb-20 mt-16">

      {/* HERO */}
      <div className="w-full h-[220px] sm:h-[280px] rounded-b-3xl bg-gradient-to-b from-[#0f3333] via-[#0c0c0c] to-[#0f3333] text-white flex flex-col items-center justify-center text-center shadow-xl px-4 sm:px-6">
        <UtensilsCrossed size={36} className="mb-2 sm:mb-3 opacity-80" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">NASCENT GARDENIA Premium Gallery</h1>
        <p className="mt-1 sm:mt-2 text-gray-300 text-sm sm:text-base max-w-xl">
          Explore our finest dishes prepared with passion & creativity.
        </p>
      </div>

      {/* SEARCH & TAGS */}
      <div className="max-w-[1400px] mx-auto mt-8 sm:mt-12 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 items-center mb-8 sm:mb-10">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search dishes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm w-full focus:ring-2 focus:ring-black/20 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={() => { setActiveTag(null); setQuery(""); }}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${!activeTag ? "bg-black text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag((s) => (s === t ? null : t))}
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${activeTag === t ? "bg-black text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((img: any, idx: number) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group cursor-pointer overflow-hidden rounded-2xl shadow-xl bg-white border border-gray-200 relative"
            >
              <button onClick={() => openLightbox(idx)} className="block w-full">
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20 bg-black/70 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full backdrop-blur">
                  ⭐ {img.badge}
                </div>
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-2 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">{img.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500">{img.caption}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
          >
            <div
              ref={lightboxRef}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[95vw] sm:max-w-[800px] h-[80vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl bg-white flex flex-col"
            >
              <button
                onClick={closeLightbox}
                className="absolute right-3 sm:right-5 top-3 sm:top-5 p-2 sm:p-3 rounded-full bg-white hover:bg-gray-100 shadow-lg z-10"
              >
                <X size={20} />
              </button>

              <div className="relative flex-1 w-full bg-black">
                <Image
                  src={filtered[lightboxIndex].src}
                  alt="preview"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-5 bg-white border-t gap-2 sm:gap-0">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800">{filtered[lightboxIndex].title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{filtered[lightboxIndex].caption}</p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <a
                    href={filtered[lightboxIndex].src}
                    download
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 shadow text-xs sm:text-sm"
                  >
                    <Download size={14} />
                  </a>
                  <button onClick={goPrev} className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={goNext} className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
