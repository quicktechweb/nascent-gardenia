"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface CartItem {
  roomTitle: string;
  packageName: string;
  quantity: number;
  price: number;
  serviceCharge: number;
  arrival: string;
  departure: string;
  roomImage?: string;
}

interface Facility {
  title: string;
  price: number;
}

interface Guest {
  firstName: string;
  lastName: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Booking {
  cart: CartItem[];
  facilities: Facility[];
  guests: Guest[];
  contact: Contact;
  address: string;
  totalPrice: number;
  status: string;
  specialRequests: string;
  nidUrl?: string;
  passportUrl?: string;
  tran_id: string;
  createdAt: string;
}

export default function SuccessPage() {
  const { tran_id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking by transaction ID
  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await axios.get(`https://nascent.virtualshopbd.com/api/booking/orders/${tran_id}`);
        setBooking(res.data);
      } catch {
        setError("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    }
    if (tran_id) fetchBooking();
  }, [tran_id]);

  // Remove paid item from localStorage cart
  useEffect(() => {
    if (tran_id) {
      const storedCart = JSON.parse(localStorage.getItem("hotel-cart") || "[]");
      if (storedCart.length > 0) {
        // Option 1: remove the first item (if cart is FIFO)
        storedCart.shift();

        // Option 2 (better): remove cart item matching tran_id
        // const updatedCart = storedCart.filter((item: any) => item.tran_id !== tran_id);

        localStorage.setItem("hotel-cart", JSON.stringify(storedCart));
      }
    }
  }, [tran_id]);

  if (loading) return <p className="text-center mt-32 text-gray-700">Loading invoice...</p>;
  if (error) return <p className="text-center mt-32 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-black mt-20">
      <div className="max-w-5xl mx-auto border rounded-md shadow-xl p-8 bg-white">
        {/* HEADER */}
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1">
              Transaction ID: <span className="font-mono">{booking?.tran_id}</span>
            </p>
          </div>
          <div className="text-sm text-right space-y-1">
            <p><span className="font-medium">Date:</span> {new Date(booking!.createdAt).toLocaleDateString()}</p>
            <p><span className="font-medium">Status:</span> <span className="uppercase font-semibold">{booking!.status}</span></p>
          </div>
        </div>

        {/* BILLING + GUESTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
          <div>
            <h2 className="font-semibold mb-4 text-gray-800">Billing Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {booking?.contact.firstName} {booking?.contact.lastName}</p>
              <p><span className="font-medium">Email:</span> {booking?.contact.email}</p>
              <p><span className="font-medium">Phone:</span> {booking?.contact.phone}</p>
              <p><span className="font-medium">Address:</span> {booking?.address}</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4 text-gray-800">Guests</h2>
            <ul className="list-disc pl-5 text-sm">
              {booking?.guests.map((g, i) => (
                <li key={i}>{g.firstName} {g.lastName}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ROOM DETAILS */}
        <div className="mt-10">
          <h2 className="font-semibold mb-3 text-gray-800">Room Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">Room</th>
                  <th className="border px-3 py-2 text-left">Image</th>
                  <th className="border px-3 py-2 text-left">Package</th>
                  <th className="border px-3 py-2 text-center">Guests</th>
                  <th className="border px-3 py-2">Arrival</th>
                  <th className="border px-3 py-2">Departure</th>
                  <th className="border px-3 py-2 text-right">Price</th>
                  <th className="border px-3 py-2 text-right">Service</th>
                </tr>
              </thead>
              <tbody>
                {booking?.cart.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="border px-3 py-2">{item.roomTitle}</td>
                    <td className="border px-3 py-2">
                      {item.roomImage ? (
                        <img src={item.roomImage} alt={item.roomTitle} className="w-20 h-14 object-cover rounded-md"/>
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="border px-3 py-2">{item.packageName}</td>
                    <td className="border px-3 py-2 text-center">{item.quantity}</td>
                    <td className="border px-3 py-2">{item.arrival}</td>
                    <td className="border px-3 py-2">{item.departure}</td>
                    <td className="border px-3 py-2 text-right">BDT {item.price}</td>
                    <td className="border px-3 py-2 text-right">BDT {item.serviceCharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FACILITIES */}
       {/* FACILITIES */}
{booking?.facilities?.length ? (
  <div className="mt-6">
    <h2 className="font-semibold mb-2 text-gray-800">Facilities</h2>
    <ul className="list-disc pl-5 text-sm">
      {booking.facilities.map((f, i) => (
        <li key={i}>{f.title} - BDT {f.price}</li>
      ))}
    </ul>
  </div>
) : null}


        {/* SPECIAL REQUESTS */}
        {booking?.specialRequests && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2 text-gray-800">Special Requests</h2>
            <p className="text-sm">{booking.specialRequests}</p>
          </div>
        )}

        {/* TOTAL + PRINT */}
        <div className="mt-10 border-t pt-4 flex justify-between items-center">
          <p className="text-lg font-semibold">Total Paid: BDT {booking?.totalPrice}</p>
          <button
            onClick={() => window.print()}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
