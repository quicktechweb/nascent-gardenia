"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const places = [
  {
    name: "SHAHABUDDIN PARK",
    image: "https://i.ibb.co.com/DPXR710Y/hotel3.jpg",
    desc: "Shahabuddin Ahmed Park is located in a dense area in Dhaka. The Park retained 1765...",
  },
  {
    name: "JAMUNA FUTURE PARK",
    image: "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    desc: "World's 12th largest shopping mall and the best one of Bangladesh...",
  },
  {
    name: "HATIRJHEEL",
    image: "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    desc: "Hatirjheel is a lakefront in Dhaka, Bangladesh that has been transformed...",
  },
  {
    name: "RAMNA PARK",
    image: "https://i.ibb.co.com/rR14fWYW/hotel4.jpg",
    desc: "A large green park in central Dhaka with beautiful walking paths...",
  },
  {
    name: "BANANI LAKE",
    image: "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    desc: "Banani Lake is a calm lakeside area perfect for evening strolls...",
  },
];

export default function LocationPage() {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % places.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const extendedPlaces = [...places, ...places];



  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + places.length) % places.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % places.length);
  };

  return (
    <div className="w-full bg-[#e9e0d9] py-24 relative overflow-hidden mt-10">
      
      {/* ===== GEOMETRIC PATTERNS ===== */}
      <style>{`
        @keyframes floatMove {
          0% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-10px) rotate(2deg) scale(1.05); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }
        .geo-animate { animation: floatMove 6s ease-in-out infinite; }
        .glow-stroke polygon {
          stroke: url(#grad) !important;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: rgba(255,255,255,0.05);
          filter: drop-shadow(0px 0px 8px rgba(0,0,0,0.08));
        }
      `}</style>

      <div className="absolute left-0 top-10 opacity-20 pointer-events-none hidden lg:block geo-animate">
        <GeoPattern size={150} />
      </div>
      <div className="absolute right-10 top-40 opacity-25 pointer-events-none hidden lg:block geo-animate">
        <GeoPattern size={120} />
      </div>
      <div className="absolute left-20 bottom-20 opacity-15 pointer-events-none hidden lg:block geo-animate">
        <GeoPattern size={100} />
      </div>

      {/* Title */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-widest font-serif mb-12 text-center text-[#2d2926]">
        LOCATION
      </h2>

      {/* Map Section */}
      <div className="w-full max-w-6xl mx-auto mb-16 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.0171535417!2d116.400324!3d39.914935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f054e5105eb2d7%3A0xe77b0615bb51d0da!2sThe%20Peninsula%20Beijing!5e0!3m2!1sen!2s!4v1700000000000"
          className="w-full h-[500px] border-0"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>

      {/* Image slider + info */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 -mt-10">
        
        {/* Left: Slider */}
    <div className="flex-[2] overflow-hidden relative rounded-xl">
      <h3 className="text-center text-sm text-black mb-2 tracking-wider">
        •NEARBY PLACES•
      </h3>

      <div className="relative">
        {/* Left Icon */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition"
        >
          <HiChevronLeft className="w-5 h-5 text-black" />
        </button>

        {/* Right Icon */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 z-10 hover:bg-gray-100 transition"
        >
          <HiChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Slider Items */}
        <div
          ref={sliderRef}
          className="flex gap-4 transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * (280 + 16)}px)`,
          }}
        >
          {extendedPlaces.map((place, i) => (
            <div
              key={i}
              className="w-72 flex-shrink-0 text-center bg-white rounded-xl shadow hover:scale-105 transform transition-all duration-300"
            >
              <Image
                src={place.image}
                alt={place.name}
                width={280}
                height={160}
                className="w-full h-40 object-cover rounded-t-xl"
              />
              <div className="p-3">
                <h3 className="text-lg font-serif text-black">{place.name}</h3>
                <p className="text-gray-500 mt-1 text-sm">{place.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>


        {/* Right: Info */}
       {/* Image slider + info */}
<div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-2 -mt-4">
  
  {/* Left: Slider */}
  <div className="flex-[2] overflow-hidden relative rounded-xl">
    <h3 className="text-center text-xs text-black mb-1 tracking-wider">
      •NEARBY PLACES•
    </h3>

    <div
      ref={sliderRef}
      className="flex gap-2 transition-transform duration-700 ease-in-out"
      style={{
        transform: `translateX(-${index * (280 + 8)}px)`,
      }}
    >
      {extendedPlaces.map((place, i) => (
        <div
          key={i}
          className="w-72 flex-shrink-0 text-center bg-white rounded-xl hover:scale-105 transform transition-all duration-200"
        >
          <Image
            src={place.image}
            alt={place.name}
            width={280}
            height={160}
            className="w-full h-40 object-cover rounded-t-xl"
          />
          <div className="p-2">
            <h3 className="text-sm font-sans text-black leading-tight">{place.name}</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-tight">{place.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Right: Info (vertical stack) */}
  <div className="flex-1 flex flex-col gap-2">
    <div className="flex flex-col justify-center p-3 rounded-xl ">
      <h4 className="text-[10px] tracking-wider text-black mt-3">
        AIRPORT DISTANCE
      </h4>
      <p className="text-xs text-black leading-tight mb-1">
        27.4 km (16.9 miles) from Beijing Capital International Airport / 52 km (32.3 miles)
      </p>
      {/* <button className="flex items-center gap-1 text-[10px] underline tracking-wide hover:text-[#bea64c] transition">
        TRANSPORTATION →
      </button> */}
    </div>

    <div className="flex flex-col justify-center p-3 rounded-xl -mt-3">
      <h4 className="text-[10px] tracking-wider text-black">
        CITY CENTER
      </h4>
      <p className="text-xs text-black leading-tight mb-1">
        5 km (3.1 miles) from downtown / easy access to restaurants and shops
      </p>
      {/* <button className="flex items-center gap-1 text-[10px] underline tracking-wide hover:text-[#bea64c] transition">
        DETAILS →
      </button> */}
    </div>

    <div className="flex flex-col justify-center p-3 rounded-xl ">
      <h4 className="text-[10px] tracking-wider text-black -mt-3">
        TOURIST SPOTS
      </h4>
      <p className="text-xs text-black leading-tight mb-1">
        Nearby attractions include historical sites, parks, and museums within 2-10 km radius
      </p>
      {/* <button className="flex items-center gap-1 text-[10px] underline tracking-wide hover:text-[#bea64c] transition">
        EXPLORE →
      </button> */}
    </div>
  </div>
</div>

      </div>
    </div>
  );
}

/* ===== Geometric Pattern Component ===== */
function GeoPattern({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      className="glow-stroke"
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stopColor="#bea64c" />
          <stop offset="100%" stopColor="#2d2926" />
        </linearGradient>
      </defs>
      <polygon points="100,10 150,60 100,110 50,60" />
      <polygon points="100,90 150,140 100,190 50,140" />
      <polygon points="60,50 100,90 60,130 20,90" />
      <polygon points="140,50 180,90 140,130 100,90" />
      <polygon points="100,60 125,90 100,120 75,90" />
    </svg>
  );
}
