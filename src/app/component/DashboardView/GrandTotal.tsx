"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface CartItem {
  _id: string;
  roomTitle: string;
  packageName: string;
  price: number;
  quantity: number;
  serviceCharge: number;
}

interface Facility {
  _id: string;
  title: string;
  price: number;
}

interface Booking {
  _id: string;
  contact: Contact;
  cart: CartItem[];
  facilities: Facility[];
  address: string;
  status: string;
  payments: string;
  invoiceSent: boolean;
  specialRequests: string;
  nidUrl?: string;
  passportUrl?: string;
  totalPrice: number;
  tran_id?: string;
  createdAt: string;
}

export default function GrandDashboard() {
  const [roomBookings, setRoomBookings] = useState<Booking[]>([]);
  const [bouquetBookings, setBouquetBookings] = useState<Booking[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [roomBookings, bouquetBookings]);

  const fetchAllBookings = async () => {
    try {
      const [roomRes, bouquetRes] = await Promise.all([
        axios.get<{ success: boolean; bookings: Booking[] }>("https://nascent.virtualshopbd.com/api/booking/all"),
        axios.get<{ success: boolean; bookings: Booking[] }>("https://nascent.virtualshopbd.com/api/bouquetbooking/all"),
      ]);

      if (roomRes.data.success) setRoomBookings(roomRes.data.bookings);
      if (bouquetRes.data.success) setBouquetBookings(bouquetRes.data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotals = () => {
    let productCount = 0;
    let total = 0;

    const allBookings = [...roomBookings, ...bouquetBookings];

    allBookings.forEach((b) => {
      if (!b.totalPrice || isNaN(b.totalPrice)) return;

      b.cart.forEach((c) => {
        productCount += c.quantity || 0;
      });

      total += b.totalPrice;
    });

    setTotalProducts(productCount);
    setGrandTotal(total);
  };

  // const allBookings = [...roomBookings, ...bouquetBookings];

  return (
    <div className="p-8">
      {/* Grand Total Dashboard Card */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer max-w-md mx-auto"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-100 text-green-600">
            <FaShoppingCart className="text-3xl" />
          </div>
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium">Grand Total Products Sold</p>
            <p className="text-3xl font-extrabold text-gray-900">{totalProducts}</p>
            <p className="text-green-600 text-xl font-extrabold mt-1">
              ৳ {grandTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Blur */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 transform transition-transform scale-95 animate-fadeIn">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <AiOutlineClose size={28} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Grand Total Details</h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Products Sold Progress</p>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-4 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalProducts / 100) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm mt-1">{totalProducts} products sold</p>
            </div>

            {/* Grand Total */}
            <div className="text-center">
              <p className="text-gray-500 text-sm font-medium">Grand Total Revenue</p>
              <p className="text-3xl font-extrabold text-green-600">৳ {grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
