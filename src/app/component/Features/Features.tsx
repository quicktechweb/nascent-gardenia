"use client";
import {
  BedDouble,
  Utensils,
  PartyPopper,
  Dumbbell,
} from "lucide-react";

export default function HotelFacilities() {
  const facilities = [
    {
      icon: <BedDouble className="w-12 h-12 text-amber-600" />,
      title: "Accommodation",
      desc: "Luxury rooms and suites designed for ultimate comfort.",
    },
    {
      icon: <Utensils className="w-12 h-12 text-emerald-600" />,
      title: "Dining",
      desc: "Experience world-class cuisine from expert chefs.",
    },
    {
      icon: <PartyPopper className="w-12 h-12 text-blue-600" />,
      title: "Banquet",
      desc: "Elegant halls perfect for weddings and corporate events.",
    },
    {
      icon: <Utensils className="w-12 h-12 text-pink-500" />,
      title: "Spa & Wellness",
      desc: "Rejuvenate with signature massages and treatments.",
    },
    {
      icon: <Dumbbell className="w-12 h-12 text-indigo-600" />,
      title: "Fitness Center",
      desc: "State-of-the-art gym facilities to stay in shape.",
    },
  ];

  return (
    <section className="relative w-full bg-white py-16 px-4 overflow-hidden">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-14">
        Our Hotel Facilities
      </h2>

      {/* FIXED 5-COLUMN GRID (same for all devices) */}
      <div className="w-full flex justify-center">
        <div
          className="grid grid-cols-5 gap-1 justify-items-center"
          style={{
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {facilities.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 flex flex-col items-center text-center
                        transform-gpu transition-all duration-500 hover:-translate-y-3 hover:rotate-x-6 hover:rotate-y-6 animate-float"
              style={{
                perspective: "1200px",
                minWidth: "200px",
                maxWidth: "230px",
              }}
            >
              {/* Icon Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/40 to-indigo-300 icon-glow" />

              {/* Icon */}
              <div className="relative z-10 mb-5 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
