"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Search, UtensilsCrossed } from "lucide-react";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PremiumGallery() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReservation, setShowReservation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [useSingleDate, setUseSingleDate] = useState(true);
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);
 const router = useRouter();


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


  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = 20; // height of your hero/banner in px (adjust if needed)
      if (window.scrollY > bannerHeight) {
        setShowReservation(true);
      } else {
        setShowReservation(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


   const [isScrolling, setIsScrolling] = useState(false);

   const normalizeDate = (date: string) => {
    if (!date) return "";
    if (date.includes("/")) {
      const [dd, mm, yyyy] = date.split("/");
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return date;
  };

  const toNum = (date: string) => new Date(date).getTime();

  


  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);
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

   const handleSearchsdata = () => {
    if (!arrival || (!useSingleDate && !departure)) {
      alert("Please select date(s)!");
      return;
    }
    const a = normalizeDate(arrival);
    const d = useSingleDate ? a : normalizeDate(departure);

    router.push(`/selectroom?arrival=${a}&departure=${d}&guests=${guests}`);
  };

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

      {showReservation && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={() => setShowModal(true)} 
            style={{
              background: isScrolling
                ? "rgba(199, 132, 54, 0.45)"
                : "rgba(199, 132, 54, 0.20)",
              border: "1.5px solid rgba(199, 132, 54, 0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: isScrolling
                ? "0 0 18px rgba(199, 132, 54, 0.6)"
                : "0 0 12px rgba(199, 132, 54, 0.45)",
              transition: "all 0.3s ease",
            }}
            className="px-8 py-3 rounded-full text-white shadow-lg flex items-center gap-2 hover:scale-110 transition-all"
          >
            <FaRegCalendarAlt className="text-xl" /> Reservations
          </button>
        </div>
      )}

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

          {/* RESERVATION MODAL */}
   {showModal && (
  <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-20">
    <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
      
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-xl font-bold"
        onClick={() => setShowModal(false)}
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold mb-4">Book a Room</h2>

      {/* Date Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          className={`flex-1 py-2 rounded ${
            useSingleDate ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setUseSingleDate(true)}
        >
          Single Date
        </button>

        <button
          className={`flex-1 py-2 rounded ${
            !useSingleDate ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setUseSingleDate(false)}
        >
          Double Date
        </button>
      </div>

      {/* Arrival Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Arrival Date</label>
        <input
          type="date"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Departure Date */}
      {!useSingleDate && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Departure Date</label>
          <input
            type="date"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      )}

      {/* Nights, Rooms, Guests */}
      <div className="mb-4 flex gap-2">

        {/* <div className="flex-1">
          <label className="block text-sm font-medium">Nights</label>
          <input
            type="number"
            min={1}
            value={nights}
            onChange={(e) => setNights(Number(e.target.value) || 1)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div> */}

        {/* <div className="flex-1">
          <label className="block text-sm font-medium">Rooms</label>
          <input
            type="number"
            min={1}
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value) || 1)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div> */}

        <div className="flex-1">
          <label className="block text-sm font-medium">Guests</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
       onClick={handleSearchsdata}
        className="w-full bg-black text-white py-3 rounded-full font-semibold"
      >
        Search Vacancy
      </button>

    </div>
  </div>
)}
    </div>
  );
}
