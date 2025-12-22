"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const images = [
  "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
  "https://images.pexels.com/photos/373541/pexels-photo-373541.jpeg",
  "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
  "https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg",
];

export default function KitchenSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-10 px-6 md:px-12 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* 🍳 Left Side - Text Content */}
        <div className="space-y-6 text-center md:text-left">
          <p className="text-sm text-gray-500 tracking-wide">• MODERN KITCHEN •</p>
          <h2 className="text-4xl font-bold text-gray-900">
            Make Your Kitchen a Masterpiece
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Discover stylish, functional kitchen designs that make  
            cooking a joy and transform your home into a modern haven.  
            From elegant finishes to smart layouts — we help you  
            create the kitchen of your dreams.
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300">
            Explore Now
          </button>
        </div>

        {/* 🖼️ Right Side - Auto Sliding Kitchen Images */}
        <div className="relative w-full h-[350px] overflow-hidden rounded-2xl shadow-lg">
         <Image
  src={images[current]}
  alt="Kitchen"
  width={800}   // approximate width
  height={500}  // approximate height
  className="object-cover transition-all duration-700 ease-in-out"
/>

        </div>
      </div>
    </section>
  );
}
