"use client";
import { useState } from "react";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal = ({ isOpen, onClose }: ReservationModalProps) => {
  const [useSingleDate, setUseSingleDate] = useState(true);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    alert(`Searching:
Arrival: ${arrival}
Departure: ${departure}
Nights: ${nights}, Rooms: ${rooms}, Guests: ${guests}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gray-50 p-6 rounded-xl max-w-md w-full shadow-md relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">Book a Room</h2>

        {/* Date Mode Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            className={`flex-1 py-2 rounded border border-gray-300 ${
              useSingleDate ? "bg-gray-200 text-gray-900 font-medium" : "bg-white text-gray-600"
            }`}
            onClick={() => setUseSingleDate(true)}
          >
            Single Date
          </button>
          <button
            className={`flex-1 py-2 rounded border border-gray-300 ${
              !useSingleDate ? "bg-gray-200 text-gray-900 font-medium" : "bg-white text-gray-600"
            }`}
            onClick={() => setUseSingleDate(false)}
          >
            Double Date
          </button>
        </div>

        {/* Arrival Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Arrival Date</label>
          <input
            type="date"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Departure Date */}
        {!useSingleDate && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Departure Date</label>
            <input
              type="date"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        )}

        {/* Nights, Rooms, Guests */}
        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Nights</label>
            <input
              type="number"
              min={1}
              value={nights}
              onChange={(e) => setNights(Number(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Rooms</label>
            <input
              type="number"
              min={1}
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Guests</label>
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-gray-800 text-white py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors"
        >
          Search Vacancy
        </button>
      </div>
    </div>
  );
};

export default ReservationModal;
