"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const places = [
  {
    name: "SHAHABUDDIN PARK",
    image:
      "https://i.ibb.co.com/DPXR710Y/hotel3.jpg",
    desc: "Shahabuddin Ahmed Park is located in a dense area in Dhaka. The Park retained 1765...",
  },
  {
    name: "JAMUNA FUTURE PARK",
    image:
      "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    desc: "World's 12th largest shopping mall and the best one of Bangladesh...",
  },
  {
    name: "HATIRJHEEL",
    image:
      "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    desc: "Hatirjheel is a lakefront in Dhaka, Bangladesh that has been transformed...",
  },
  {
    name: "RAMNA PARK",
    image:
      "https://i.ibb.co.com/rR14fWYW/hotel4.jpg",
    desc: "A large green park in central Dhaka with beautiful walking paths...",
  },
  {
    name: "BANANI LAKE",
    image:
      "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    desc: "Banani Lake is a calm lakeside area perfect for evening strolls...",
  },
];

export default function NearbyPlace() {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % places.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const extendedPlaces = [...places, ...places];

  return (
    <div className="bg-[#0f3333] text-white py-16">
      <h3 className="text-center text-sm text-gray-400 mb-2 tracking-wider">
        •NEARBY PLACES•
      </h3>
      <h2 className="text-center text-3xl font-bold mb-10">
        EXPLORE AND EXPERIENCE <br /> THE PLACES NEARBY OUR HOTEL
      </h2>

      <div className="overflow-hidden relative w-full max-w-5xl mx-auto">
        <div
          ref={sliderRef}
          className="flex gap-2 transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * (320 + 32)}px)`,
          }}
        >
          {extendedPlaces.map((place, i) => (
            <div key={i} className="w-80 flex-shrink-0 text-center">
              <Image
                src={place.image}
                alt={place.name}
                width={320}
                height={192}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl mt-4 font-serif">{place.name}</h3>
              <p className="text-gray-400 mt-2 text-sm px-2">{place.desc}</p>
            </div>
          ))}

          
        </div>

        <div className="w-full max-w-6xl mx-auto">
  <div 
    className="relative w-full h-[300px] border border-gray-300 mt-5 overflow-hidden"
    aria-label="Location map - The Peninsula Beijing"
  >
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.0171535417!2d116.400324!3d39.914935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f054e5105eb2d7%3A0xe77b0615bb51d0da!2sThe%20Peninsula%20Beijing!5e0!3m2!1sen!2s!4v1700000000000"
      className="w-full h-full border-0"
      loading="lazy"
      allowFullScreen
    ></iframe>
  </div>
</div>
      </div>
    </div>
  );
}
