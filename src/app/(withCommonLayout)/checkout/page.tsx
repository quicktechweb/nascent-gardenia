"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const uploadToImgbb = async (file: File) => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
    fd
  );

  return res.data.data.url;
};

type CartItem = {
  roomId: string;
  roomTitle: string;
  packageId: string;
  packageName: string;
  price: number;
  quantity: number;
  arrival: string;
  departure: string;
  guests: number; 
  serviceCharge: number; 
};

interface Facility {
  title: string;
  price: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  // const [nidFile, setNidFile] = useState<File | null>(null);
  // const [passportFile, setPassportFile] = useState<File | null>(null);
  const [nidNumber, setNidNumber] = useState("");
const [passportNumber, setPassportNumber] = useState("");

  const [contact, setContact] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", securityCode: "" });
  const [specialRequests, setSpecialRequests] = useState("");

  const [guests, setGuests] = useState([{ firstName: "", lastName: "" }]);

  const facilities: Facility[] = [
    { title: "Fan Facilities", price: 400 },
    { title: "Room Service", price: 500 },
    { title: "Breakfast", price: 300 },
    { title: "Extra Bed", price: 600 },
  ];

 useEffect(() => {
  const saved = localStorage.getItem("hotel-cart");
  if (saved) {
    const parsed: CartItem[] = JSON.parse(saved).map((item: Partial<CartItem>) => ({
      ...item,
      serviceCharge: 500, // ✅ per cart item
    }));
    setCart(parsed);
  }
}, []);


// Example: on payment success callback
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("payment_status") === "success") {
    const cart = JSON.parse(localStorage.getItem("hotel-cart") || "[]");
    cart.shift(); // remove first item
    localStorage.setItem("hotel-cart", JSON.stringify(cart));
  }
}, []);




  const serviceCharge = 500;
  const roomTotal = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const serviceChargeTotal = cart.reduce(
  (sum, item) => sum + item.serviceCharge,
  0
);

const facilitiesTotal = selectedFacilities.reduce(
  (sum, f) => sum + f.price,
  0
);

const totalPrice =
  roomTotal + serviceChargeTotal + facilitiesTotal;


  const addGuest = () => setGuests([...guests, { firstName: "", lastName: "" }]);
  const handleGuestChange = (
  index: number,
  field: "firstName" | "lastName",
  value: string
) => {
  const newGuests = [...guests];
  newGuests[index][field] = value;
  setGuests(newGuests);
};

  const toggleFacility = (facility: Facility) => {
    if (selectedFacilities.find(f => f.title === facility.title)) {
      setSelectedFacilities(selectedFacilities.filter(f => f.title !== facility.title));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

//   const handleBookingSubmit = async () => {
//   try {
//     // Filter guests with valid name
//     const filteredGuests = guests.filter(
//       g => g.firstName.trim() !== "" && g.lastName.trim() !== ""
//     );

//     // Upload files if provided
//     const nidUrl = nidFile ? await uploadToImgbb(nidFile) : undefined;
//     const passportUrl = passportFile ? await uploadToImgbb(passportFile) : undefined;

//     // Send all booking data
//     const res = await axios.post("https://nascent.virtualshopbd.com/api/booking/create", {
//      cart, // 👈 cart এর ভিতরেই serviceCharge আছে
//   guests: filteredGuests,
//   facilities: selectedFacilities,
//   contact,
//   address,
//   payment,
//   specialRequests,
//   nidUrl,
//   passportUrl,

//   roomTotal,
//   serviceChargeTotal,
//   facilitiesTotal,
//   totalPrice,
//     });

//     if (res.data.success) {
//       alert("Booking successful!");

//       // 🧹 Clear LocalStorage Cart
//       localStorage.removeItem("hotel-cart");

//       // 🧹 Reset All Fields
//       setGuests([{ firstName: "", lastName: "" }]);
//       setSelectedFacilities([]);
//       setContact({ firstName: "", lastName: "", phone: "", email: "" });
//       setAddress("");
//       setPayment({ cardNumber: "", expiry: "", securityCode: "" });
//       setSpecialRequests("");
//       setNidFile(null);
//       setPassportFile(null);
//       setCart([]);

//       // If cart comes from props or context, you may also need
//       // reload page or redirect based on your UI
//       // router.push("/success")  // optional redirect
//     }

//   } catch (err) {
//     console.error(err);
//     alert("Booking failed!");
//   }
// };

const handleBookingSubmit = async () => {
  try {
    const filteredGuests = guests.filter(
      g => g.firstName.trim() !== "" && g.lastName.trim() !== ""
    );

    const res = await axios.post(
      "https://nascent.virtualshopbd.com/api/booking/create",
      {
        cart,
        guests: filteredGuests,
        facilities: selectedFacilities,
        contact,
        address,
        specialRequests,

        // ✅ numbers only
        nidNumber,
        passportNumber,

        roomTotal,
        serviceChargeTotal,
        facilitiesTotal,
        totalPrice,
      }
    );

    if (res.data?.success && res.data?.url) {
      window.location.href = res.data.url;
      return;
    }

    alert("Booking created but payment failed. Please retry payment.");
  } catch (err) {
    console.error("Booking submit error:", err);
    alert("Booking failed! Please try again.");
  }
};








  return (
    <div className="w-full bg-white flex justify-center px-5 md:px-0 py-10">
      <div className="w-full md:w-[1200px] grid grid-cols-1 md:grid-cols-12 gap-8 mt-10">
        
        {/* LEFT SECTION */}
        <div className="col-span-1 md:col-span-8 w-full">
          {/* CONTACT INFO */}
          <div className="mb-6 mt-10">
            <h2 className="text-[15px] text-black font-semibold mb-2">
              CONTACT INFO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-black mb-1">First Name *</label>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59] text-sm"
                  value={contact.firstName}
                  onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59] text-sm"
                  value={contact.lastName}
                  onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59] text-sm"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-black mb-1 ">Email *</label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59] text-sm"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>

              {/* NID Card Upload */}
           <>
      {/* NID Upload */}
      {/* NID Number */}
<div className="flex flex-col">
  <label className="text-xs font-semibold text-gray-700 mb-1">
    NID Number *
  </label>
  <input
    type="text"
    placeholder="Enter NID Number"
    className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59] text-sm"
    value={nidNumber}
    onChange={(e) => setNidNumber(e.target.value)}
  />
</div>

{/* Passport Number */}
<div className="flex flex-col">
  <label className="text-xs font-semibold text-gray-700 mb-1">
    Passport Number *
  </label>
  <input
    type="text"
    placeholder="Enter Passport Number"
    className="w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59] text-sm"
    value={passportNumber}
    onChange={(e) => setPassportNumber(e.target.value)}
  />
</div>

    </>

            </div>
          </div>

          <div className="mb-6">
  <h2 className="text-[15px] font-semibold mb-2 text-black">GUESTS</h2>

  {guests.map((guest, index) => (
    <div key={index} className="grid grid-cols-2 gap-4 mb-3">
      <input
        type="text"
        className="border px-2 py-1 rounded text-black"
        placeholder="First Name"
        value={guest.firstName}
        onChange={(e) => handleGuestChange(index, "firstName", e.target.value)}
      />
      <input
        type="text"
        className="border px-2 py-1 rounded text-black"
        placeholder="Last Name"
        value={guest.lastName}
        onChange={(e) => handleGuestChange(index, "lastName", e.target.value)}
      />
    </div>
  ))}

  <button
    className="bg-[#b79a59] text-white px-3 py-1 rounded-sm"
    onClick={addGuest}
  >
    + Add Guest
  </button>
</div>


          {/* ADDRESS */}
          <div className="mb-6">
            <h2 className="text-[15px] font-semibold mb-2 text-black">ADDRESS</h2>
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full border border-gray-300 text-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b79a59] focus:border-[#b79a59]"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* EXTRA FACILITIES */}
          <div className="border p-4 rounded-sm mb-6">
            <details open>
              <summary className="cursor-pointer text-[14px] font-semibold text-black">
                EXTRA FACILITIES
              </summary>
              <div className="mt-4 text-black">
                {facilities.map((facility, idx) => (
                  <label key={idx} className="flex items-center gap-2 mb-2 cursor-pointer text-black">
                    <input
                      type="checkbox"
                      className="text-black"
                      checked={selectedFacilities.some(f => f.title === facility.title)}
                      onChange={() => toggleFacility(facility)}
                    />
                    <span className="text-sm">{facility.title} - ৳{facility.price}</span>
                  </label>
                ))}
                {selectedFacilities.length > 0 && (
                  <div className="mt-3 p-2 bg-gray-100 rounded-md text-sm text-black">
                    <b>Selected Facilities:</b>
                    <ul className="list-disc ml-5 mt-1">
                      {selectedFacilities.map((f, idx) => (
                        <li key={idx}>{f.title} - ৳{f.price}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
          </div>

          {/* SPECIAL REQUESTS */}
          <div className="border p-4 rounded-sm mb-6">
            <details open>
              <summary className="cursor-pointer text-[14px] font-semibold text-black">
                SPECIAL REQUESTS
              </summary>
              <textarea
                className="w-full border text-black rounded-sm px-3 py-2 text-sm mt-3"
                placeholder="Please enter your requests..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              ></textarea>
            </details>
          </div>

          {/* PAYMENT METHODS */}
          <div className="mb-6 text-black">
            <h2 className="text-[15px] font-semibold mb-2">PAYMENT</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Card Number"
                className="w-full border rounded-sm px-3 py-2 mt-1 text-sm"
                value={payment.cardNumber}
                onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
              />
              <input
                placeholder="Expiry"
                className="w-full border rounded-sm px-3 py-2 mt-1 text-sm"
                value={payment.expiry}
                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
              />
              <input
                placeholder="Security Code"
                className="w-full border rounded-sm px-3 py-2 mt-1 text-sm"
                value={payment.securityCode}
                onChange={(e) => setPayment({ ...payment, securityCode: e.target.value })}
              />
            </div>
          </div>

          <div className="border p-4 rounded-sm mb-6 bg-[#fafafa] text-[13px] leading-[18px]">
            <h3 className="font-semibold text-black mb-2 text-[14px]">POLICIES</h3>
            <p className="text-black">
              <b>Check-in:</b> 3:00 PM
            </p>
            <p className="text-black">
              <b>Check-out:</b> 12:00 PM
            </p>
            <p className="mt-2 text-black">
              Guests must provide valid ID at check-in. Late cancellations may
              incur additional fees.
            </p>
          </div>

          {/* AGREEMENTS */}
          <div className="border p-4 rounded-sm mb-6 text-[13px] leading-[18px] text-black">
            <h3 className="font-semibold mb-2 text-[14px]">AGREEMENTS</h3>
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>I agree to the Terms & Conditions.</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>I agree to the cancellation policy.</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span>I authorize payment for this reservation.</span>
              </label>
            </div>
          </div>

          <button
            className="w-full bg-[#b79a59] text-white py-3 font-semibold rounded-sm hover:bg-[#a5894e]"
            onClick={handleBookingSubmit}
          >
            CONFIRM BOOKING
          </button>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="col-span-1 md:col-span-4 w-full">
          <div className="w-full md:min-h-screen bg-[#f5f5f5] text-black flex flex-col items-center py-10 gap-10">

            {/* CART SUMMARY */}
            <div className="w-full md:w-[360px] bg-white shadow-md p-5 rounded-md">
              <h3 className="text-[16px] mb-2 font-semibold">
                Your Cart: {cart.length} {cart.length === 1 ? "Item" : "Items"}
              </h3>

              {/* TOTAL */}
              <div className="flex justify-between text-[14px]">
                <span>Total</span>
                <span className="font-bold">৳ {totalPrice}</span>
              </div>

              <p className="text-[12px] text-gray-500 mt-1">Including taxes and fees</p>

              {cart.length === 0 && (
                <div className="border p-4 mt-3 rounded-md text-gray-500">
                  <div className="font-bold">No items in your cart</div>
                  <div className="flex justify-between text-[14px] mt-2">
                    <span>Room Charges</span>
                    <span>৳ 0</span>
                  </div>
                  <div className="flex justify-between text-[14px] mt-1">
                    <span>Service Charge</span>
                    <span>৳ 0</span>
                  </div>
                  <div className="flex justify-between text-[14px] mt-1">
                    <span>Stay</span>
                    <span>—</span>
                  </div>
                </div>
              )}

              {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.packageId} className="p-4 bg-white rounded-md shadow">
              
              <div className="font-semibold">{item.roomTitle}</div>
              <div className="text-gray-600">{item.packageName}</div>
              <div className="flex justify-between text-[14px] mt-1">
  <span>Guests</span>
  <span>{item.guests}</span>
</div>

              <div>
                {item.arrival} → {item.departure}
              </div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: ৳ {item.price * item.quantity}</div>
               <div className="flex justify-between text-[14px] mt-1">
          <span>Service Charge</span>
          <span>৳ {serviceCharge}</span>
        </div>
            </div>
          ))}
          <div className="font-bold text-lg">Total: ৳ {totalPrice}</div>

           
        </div>
      )}

              <div className="flex justify-between font-bold text-[16px] mt-4">
                <span>Total</span>
                <span>৳ {totalPrice}</span>
              </div>

              <button className="w-full bg-[#b89c5a] text-white py-3 rounded-md mt-4 hover:bg-[#a88a4f] text-sm">
                CHECKOUT
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
