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

interface BouquetBooking {
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

export default function Bouquetdata() {
  const [bookings, setBookings] = useState<BouquetBooking[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get<{ success: boolean; bookings: BouquetBooking[] }>(
        "https://nascent.virtualshopbd.com/api/bouquetbooking/all"
      );
      if (res.data.success) setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotals = () => {
    let productCount = 0;
    let revenue = 0;

    bookings.forEach((b) => {
      if (!b.totalPrice || isNaN(b.totalPrice)) return;

      b.cart.forEach((c) => {
        productCount += c.quantity || 0;
        revenue += (c.price || 0) * (c.quantity || 0) + (c.serviceCharge || 0);
      });
    });

    setTotalProducts(productCount);
    setTotalRevenue(revenue);
  };

  return (
    <div className="p-8 ">
      {/* Premium Dashboard Card */}
      <div
        onClick={() => setShowModal(true)}
        className="bg-white p-6 rounded-2xl shadow-[0_2px_18px_rgba(0,0,0,0.15)] border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer max-w-md mx-auto"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-100 text-green-600">
            <FaShoppingCart className="text-3xl" />
          </div>
          <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium">Total Bouquets Sold</p>
            <p className="text-3xl font-extrabold text-gray-900">{totalProducts}</p>
            <p className="text-green-600 text-xl font-extrabold mt-1">
              ৳ {totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalProducts / 100) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl mx-4 md:mx-0 transform transition-transform scale-95 animate-fadeIn">
            <button
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <AiOutlineClose size={28} />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">All Bouquet Bookings</h2>

              <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full border-collapse text-gray-700">
                  <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <tr>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Name</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Email</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Phone</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Address</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Status</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Products</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Facilities</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">Total Price</th>
                      <th className="border px-4 py-3 text-left text-gray-600 uppercase text-xs font-medium">NID / Passport</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => {
                      if (!b.totalPrice || isNaN(b.totalPrice)) return null;

                      const productSummary = b.cart
                        .map((c) => `${c.roomTitle} (${c.quantity})`)
                        .join(", ");

                      const facilitySummary = b.facilities
                        .map((f) => `${f.title} (${f.price})`)
                        .join(", ");

                      const totalBookingPrice = b.cart.reduce(
                        (sum, c) => sum + (c.price || 0) * (c.quantity || 0) + (c.serviceCharge || 0),
                        0
                      );

                      return (
                        <tr key={b._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="border px-4 py-3">{b.contact.firstName} {b.contact.lastName}</td>
                          <td className="border px-4 py-3">{b.contact.email}</td>
                          <td className="border px-4 py-3">{b.contact.phone}</td>
                          <td className="border px-4 py-3">{b.address}</td>
                          <td className="border px-4 py-3 capitalize">{b.status}</td>
                          <td className="border px-4 py-3">{productSummary}</td>
                          <td className="border px-4 py-3">{facilitySummary || "N/A"}</td>
                          <td className="border px-4 py-3 font-semibold text-green-600">${totalBookingPrice}</td>
                          <td className="border px-4 py-3">
                            {b.nidUrl && <img src={b.nidUrl} alt="NID" className="w-12 h-12 object-cover rounded" />}
                            {b.passportUrl && <img src={b.passportUrl} alt="Passport" className="w-12 h-12 object-cover rounded ml-2" />}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
