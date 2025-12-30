"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function SpecialOffer() {
  const formRef = useRef<HTMLDivElement | null>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [hero, setHero] = useState<any>({});
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://nascent.virtualshopbd.com/api/special-section");
        const data = res.data;
        setHero(data.hero || {});
        setOffers(data.offers || []);
        setPackages(data.packages || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
  
       const handleSearchsdata = () => {
      if (!arrival || (!useSingleDate && !departure)) {
        alert("Please select date(s)!");
        return;
      }
      const a = normalizeDate(arrival);
      const d = useSingleDate ? a : normalizeDate(departure);
  
      router.push(`/selectroom?arrival=${a}&departure=${d}&guests=${guests}`);
    };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-[#e9e0d9] text-gray-800">
      {/* HERO */}
      <div className="relative w-full h-[400px] sm:h-[480px] md:h-[600px] overflow-hidden">
        {hero.image && (
          <Image
            src={hero.image}
            alt={hero.title || "Special Offers Banner"}
            fill
            className="object-cover scale-105 transition-transform duration-700"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg"
          >
            {hero.title || "SPECIAL OFFERS"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm sm:text-base md:text-lg text-white/90 tracking-wider"
          >
            {hero.subtitle || "ROOMS, FITNESS, BANQUET & DINING"}
          </motion.p>
          <motion.button
            onClick={scrollToForm}
            whileHover={{ scale: 1.05 }}
            className="mt-4 bg-[#bea64c] hover:bg-red-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full font-medium shadow-lg"
          >
            Book Now
          </motion.button>
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
      </div>

      {/* OFFERS GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12">
          Our Services & Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {offers.map((o, idx) => (
            <motion.div
              key={o._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            >
              {o.img && (
                <div className="relative w-full h-36 sm:h-40 md:h-48">
                  <Image src={o.img} alt={o.title} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="p-3 sm:p-4 text-center">
                <h3 className="font-semibold text-base sm:text-lg md:text-lg mb-1">{o.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{o.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PACKAGES GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 -mt-16 py-12 sm:py-16 rounded-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12">
          Special Packages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-6">
          {packages.map((p, idx) => (
            <motion.div
              key={p._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              {p.img && (
                <div className="relative w-full h-32 sm:h-36 md:h-36">
                  <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="p-4 sm:p-5 text-center flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">{p.name}</h3>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{p.price}</div>
                <ul className="text-gray-600 text-xs sm:text-sm space-y-1">
                  {p.features?.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <button
                  onClick={scrollToForm}
                  className="mt-2 sm:mt-3 bg-[#bea64c] hover:bg-red-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-full font-medium transition-all"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
