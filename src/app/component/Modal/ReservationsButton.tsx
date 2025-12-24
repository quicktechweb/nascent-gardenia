"use client";

import { useState, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ReservationSystem = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Form state
  const [useSingleDate, setUseSingleDate] = useState(true);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState(1);

  // Scroll effect for button
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

  const normalizeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  const handleSearch = () => {
    if (!arrival || (!useSingleDate && !departure)) {
      alert("Please select date(s)!");
      return;
    }

    const a = normalizeDate(arrival);
    const d = useSingleDate ? a : normalizeDate(departure);

    router.push(`/selectroom?arrival=${a}&departure=${d}&guests=${guests}`);
    setShowModal(false);
  };

  return (
    <>
      {/* ---------- Floating Reservations Button ---------- */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
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

      {/* ---------- Reservation Modal ---------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-50">
          <div className="bg-gray-50 p-6 rounded-xl max-w-md w-full shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-xl font-bold text-black hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">Book a Room</h2>

            {/* Date Mode Toggle */}
            <div className="mb-4 flex gap-2">
              <button
                className={`flex-1 py-2 rounded border ${
                  useSingleDate
                    ? "bg-gray-200 font-semibold"
                    : "bg-white text-gray-600"
                }`}
                onClick={() => setUseSingleDate(true)}
              >
                Single Date
              </button>
              <button
                className={`flex-1 py-2 rounded border ${
                  !useSingleDate
                    ? "bg-gray-200 font-semibold"
                    : "bg-white text-gray-600"
                }`}
                onClick={() => setUseSingleDate(false)}
              >
                Double Date
              </button>
            </div>

            {/* Arrival Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Arrival Date
              </label>
              <input
                type="date"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Departure Date */}
            {!useSingleDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            )}

            {/* Guests */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Guests
              </label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors"
            >
              Search Vacancy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReservationSystem;
