"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SpecialOffer() {
  const formRef = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  interface FormDataValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

type FormErrors = { [key: string]: string };

const validate = (data: FormDataValues): FormErrors => {
  const errors: FormErrors = {};

  if (!data.firstName?.trim()) errors.firstName = "First name required";
  if (!data.lastName?.trim()) errors.lastName = "Last name required";
  if (!data.email?.trim()) errors.email = "Email required";
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Email invalid";
  if (!data.phone?.trim()) errors.phone = "Phone required";

  return errors;
};


  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSuccess(null);
    setErrors({});
    const form = ev.target as HTMLFormElement;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const e = validate(data);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSuccess("Thanks — your booking query has been received. We will contact you shortly.");
    form.reset();
    window.scrollTo({ top: formRef.current?.getBoundingClientRect().top ?? 0 + window.scrollY - 80, behavior: "smooth" });
  };

  const offers = [
    { title: "Luxury Rooms", desc: "Premium comfort and elegant interiors.", img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
    { title: "Fitness Center", desc: "Modern equipment for all your workouts.", img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
    { title: "Banquet Hall", desc: "Perfect for weddings, parties & events.", img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
    { title: "Fine Dining", desc: "Gourmet cuisine by top chefs.", img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
  ];

  const packages = [
    { name: "Weekend Getaway", price: "$299", features: ["Luxury Room", "Breakfast", "Fitness Access"], img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
    { name: "Banquet Special", price: "$999", features: ["Banquet Hall", "Catering", "Decoration"], img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
    { name: "Dining Experience", price: "$149", features: ["Fine Dining Menu", "Exclusive Chef", "Wine Pairing"], img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
    { name: "Dining Experience", price: "$149", features: ["Fine Dining Menu", "Exclusive Chef", "Wine Pairing"], img: "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg" },
  ];

  const testimonials = [
    { name: "Rahim Ahmed", text: "A wonderful stay! The rooms and services exceeded expectations.", avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Sara Khan", text: "Amazing dining experience and friendly staff. Highly recommended.", avatar: "https://i.pravatar.cc/100?img=2" },
    { name: "Imran Hossain", text: "Banquet hall was perfect for our wedding. Exceptional service.", avatar: "https://i.pravatar.cc/100?img=3" },
  ];

  return (
    <div className="bg-[#e9e0d9] text-gray-800">
      {/* HERO */}
      <div className="relative w-full h-[400px] sm:h-[480px] md:h-[600px] overflow-hidden">
        <Image
          src="https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg"
          alt="Special Offers Banner"
          fill
          className="object-cover scale-105 transition-transform duration-700"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg"
          >
            SPECIAL OFFERS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm sm:text-base md:text-lg text-white/90 tracking-wider"
          >
            ROOMS, FITNESS, BANQUET & DINING
          </motion.p>
          <motion.button
            onClick={scrollToForm}
            whileHover={{ scale: 1.05 }}
            className="mt-4 bg-[#bea64c] hover:bg-red-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full font-medium shadow-lg"
          >
            Book Now
          </motion.button>
        </div>
      </div>

      {/* OFFERS GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12">Our Services & Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {offers.map((o, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="relative w-full h-36 sm:h-40 md:h-48">
                <Image src={o.img} alt={o.title} fill className="object-cover" unoptimized />
              </div>
              <div className="p-3 sm:p-4 text-center">
                <h3 className="font-semibold text-base sm:text-lg md:text-lg mb-1">{o.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{o.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PACKAGES */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 -mt-16 py-12 sm:py-16 rounded-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12">Special Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-6">
          {packages.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="relative w-full h-32 sm:h-36 md:h-36">
                <Image src={p.img} alt={p.name} fill className="object-cover" unoptimized />
              </div>
              <div className="p-4 sm:p-5 text-center flex flex-col gap-2 sm:gap-3">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold">{p.name}</h3>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{p.price}</div>
                <ul className="text-gray-600 text-xs sm:text-sm space-y-1">
                  {p.features.map((f, i) => (
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

      {/* TESTIMONIALS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 py-12 -mt-16 sm:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12">What Our Guests Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 flex flex-col gap-2 sm:gap-3 items-center text-center hover:shadow-xl transition-shadow"
            >
              <Image src={t.avatar} alt={t.name} width={50} height={50} className="rounded-full" />
              <p className="text-gray-700 text-xs sm:text-sm md:text-base">{t.text}</p>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">{t.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOOKING FORM */}
      <div ref={formRef} className="max-w-6xl mx-auto px-6 sm:px-5 md:px-5 py-12 sm:py-16 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-3 text-center">Book Your Offer</h3>
          <p className="text-center text-gray-500 mb-8 sm:mb-10">We reply within 24 hours</p>
          <form onSubmit={onSubmit} className="grid gap-3 sm:gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <input
                name="firstName"
                placeholder="First Name *"
                className={`block w-full border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none ${errors.firstName ? "border-red-400" : "border-gray-200"}`}
              />
              <input
                name="lastName"
                placeholder="Last Name *"
                className={`block w-full border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none ${errors.lastName ? "border-red-400" : "border-gray-200"}`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <input
                name="email"
                placeholder="Email *"
                className={`block w-full border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none ${errors.email ? "border-red-400" : "border-gray-200"}`}
              />
              <input
                name="phone"
                placeholder="Phone *"
                className={`block w-full border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none ${errors.phone ? "border-red-400" : "border-gray-200"}`}
              />
            </div>
            <textarea
              name="message"
              rows={4}
              placeholder="Message"
              className="block w-full border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none border-gray-200 resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#bea64c] hover:bg-red-700 text-white py-2 sm:py-3 px-3 sm:px-5 rounded-full font-medium shadow w-full sm:w-auto mt-2 sm:mt-3 transition-all"
            >
              {submitting ? "Sending..." : "Submit Now"}
            </button>
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl bg-green-50 text-green-700 border border-green-100 text-center">
                {success}
              </motion.div>
            )}
          </form>
        </div>
      </div>

      {/* FLOATING CTA */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        onClick={scrollToForm}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3"
        aria-label="Book an offer"
      >
        Book Now
      </motion.button>
    </div>
  );
}
