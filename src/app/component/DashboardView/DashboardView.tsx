"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

/* ================= TYPES ================= */
interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface CartItem {
  _id: string;
  roomTitle: string;
  price: number;
  quantity: number;
  serviceCharge: number;
}

interface Booking {
  _id: string;
  contact: Contact;
  cart: CartItem[];
  totalPrice?: number;
  createdAt: string;
  source: "room" | "bouquet";
}
interface RoomBookingResponse {
  _id: string;
  contact: Contact;
  cart: CartItem[];
  totalPrice?: number;
  createdAt: string;
}

interface BouquetBookingResponse {
  _id: string;
  contact: Contact;
  cart: CartItem[];
  totalPrice?: number;
  createdAt: string;
}

interface StatCardProps {
  title: string;
  count: number;
  amount: number;
  onClick: () => void;
  highlight?: boolean;
}

/* ================= COMPONENT ================= */
export default function UnifiedDashboard3Cards() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState<"room" | "bouquet" | "all">("all");

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAll = async () => {
      const [roomRes, bouquetRes] = await Promise.all([
        axios.get("https://nascent.virtualshopbd.com/api/booking/all"),
        axios.get("https://nascent.virtualshopbd.com/api/bouquetbooking/all"),
      ]);

     setAllBookings([
  ...(roomRes.data.bookings as RoomBookingResponse[]).map(b => ({ ...b, source: "room" } as Booking)),
  ...(bouquetRes.data.bookings as BouquetBookingResponse[]).map(b => ({ ...b, source: "bouquet" } as Booking)),
]);
    };

    fetchAll();
  }, []);

  /* ================= FILTER ================= */
  const roomBookings = useMemo(
    () => allBookings.filter(b => b.source === "room"),
    [allBookings]
  );

  const bouquetBookings = useMemo(
    () => allBookings.filter(b => b.source === "bouquet"),
    [allBookings]
  );

  /* ================= TOTAL CALC ================= */
  const sumTotal = (items: Booking[]) =>
    items.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  const roomTotal = sumTotal(roomBookings);
  const bouquetTotal = sumTotal(bouquetBookings);
  const grandTotal = roomTotal + bouquetTotal;

  const modalData =
    activeType === "room"
      ? roomBookings
      : activeType === "bouquet"
      ? bouquetBookings
      : [...roomBookings, ...bouquetBookings];

  /* ================= UI ================= */
  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* ===== CARDS ===== */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatCard
          title="Total Room Bookings"
          count={roomBookings.length}
          amount={roomTotal}
          onClick={() => {
            setActiveType("room");
            setShowModal(true);
          }}
        />

        <StatCard
          title="Total Bouquet Orders"
          count={bouquetBookings.length}
          amount={bouquetTotal}
          onClick={() => {
            setActiveType("bouquet");
            setShowModal(true);
          }}
        />

        <StatCard
          title="Grand Total Sales"
          count={roomBookings.length + bouquetBookings.length}
          amount={grandTotal}
          highlight
          onClick={() => {
            setActiveType("all");
            setShowModal(true);
          }}
        />
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white w-full max-w-5xl rounded-3xl p-6 shadow-2xl">
            <button
              className="absolute top-5 right-5"
              onClick={() => setShowModal(false)}
            >
              <AiOutlineClose size={26} />
            </button>

            <h2 className="text-2xl font-bold mb-5 capitalize">
              {activeType} bookings
            </h2>

            <div className="max-h-[420px] overflow-y-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {modalData.map(b => (
                    <tr key={b._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 capitalize">{b.source}</td>
                      <td className="p-3">
                        {b.contact.firstName} {b.contact.lastName}
                      </td>
                      <td className="p-3">{b.contact.phone}</td>
                      <td className="p-3 font-semibold text-emerald-600">
                        ৳ {Number(b.totalPrice) || 0}
                      </td>
                      <td className="p-3">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
/* ================= PREMIUM CARD ================= */
function StatCard({ title, count, amount, onClick, highlight }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer
        w-full min-w-[280px]
        rounded-[26px]
        p-[2px]
        
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.04]
        active:scale-[0.98]
        ${
          highlight
            ? "bg-gradient-to-br from-[#c78436] via-[#0f3333] to-[#a6712e]" // Grand Total
            : "bg-gradient-to-br from-[#c78436] via-[#0f3333] to-[#a6712e]" // Room & Bouquet soft background
        }
      `}
    >
      <div className="relative bg-white/90 backdrop-blur  rounded-[24px] px-7 py-6 min-h-[170px] shadow-xl flex flex-col justify-between overflow-hidden gap-4">

        {/* Glow effect for highlight */}
        {highlight && (
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#c78436]/20 rounded-full blur-3xl" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-sm font-semibold tracking-wide">
            {title}
          </p>

          <div className="p-3 rounded-xl bg-gradient-to-br from-[#c78436] to-[#a6712e] text-white shadow-sm">
            <FaShoppingCart className="text-xl" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <p className="text-[34px] font-extrabold leading-none text-gray-900">
            {count}
          </p>

          <p className="text-lg font-bold bg-gradient-to-r from-[#c78436] to-[#a6712e] bg-clip-text text-transparent">
            ৳ {amount.toFixed(2)}
          </p>
        </div>

        {/* Bottom shine line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      </div>
    </div>
  );
}




