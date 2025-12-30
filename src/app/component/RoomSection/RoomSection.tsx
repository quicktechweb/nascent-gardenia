"use client";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
import axios from "axios";

type Room = {
  _id: string;
  title: string;
  description: string;
  bigImage: string;
  smallImage: string;
};

export default function RoomSection() {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get<Room[]>(
          "https://nascent.virtualshopbd.com/api/landingroom/add"
        );
        if (res.data.length > 0) setRoom(res.data[0]); // show first room
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoom();
  }, []);

if (!room) {
    return (
      <div className="w-full bg-[#e8dfd9] py-20 relative overflow-hidden">
        <style>
          {`
            @keyframes shimmer {
              0% { background-position: -500px 0; }
              100% { background-position: 500px 0; }
            }
            .shimmer {
              background: linear-gradient(
                90deg,
                #e0e0e0 0%,
                #f0f0f0 50%,
                #e0e0e0 100%
              );
              background-size: 1000px 100%;
              animation: shimmer 1.8s infinite linear;
            }
            .shimmer-scale {
              transform-origin: center;
              animation: shimmer-scale 1.6s infinite alternate;
            }
            @keyframes shimmer-scale {
              0% { transform: scale(1); }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); }
            }
          `}
        </style>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[40%_25%_35%] gap-6 px-4">
          {/* TEXT SKELETON */}
          <div className="order-1 lg:order-3 flex flex-col justify-center lg:pr-10 space-y-4">
            <div className="h-16 w-3/4 rounded-2xl shimmer shadow-lg shimmer-scale"></div>
            <div className="h-6 rounded-xl shimmer shadow-md max-w-[500px] shimmer-scale"></div>
            <div className="h-6 rounded-xl shimmer shadow-md max-w-[450px] shimmer-scale"></div>
            <div className="h-6 rounded-xl shimmer shadow-md max-w-[400px] shimmer-scale"></div>
            <div className="h-10 w-40 rounded-full shimmer shadow-lg shimmer-scale mt-4"></div>
          </div>

          {/* BIG IMAGE SKELETON */}
          <div className="order-2 lg:order-1 w-full h-[380px] sm:h-[450px] lg:h-[620px] rounded-3xl shimmer shadow-xl shimmer-scale"></div>

          {/* SMALL IMAGE SKELETON */}
          <div className="order-3 lg:order-2 w-full lg:w-[300px] h-[300px] sm:h-[350px] lg:h-[380px] rounded-3xl shimmer shadow-lg lg:top-[300px] shimmer-scale"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#e8dfd9] py-20 relative overflow-hidden">

      {/* ===== GEOMETRIC PATTERN ANIMATION CSS ===== */}
      <style>
        {`
          @keyframes floatMove {
            0% { transform: translateY(0px) rotate(0deg) scale(1); }
            50% { transform: translateY(-15px) rotate(2deg) scale(1.05); }
            100% { transform: translateY(0px) rotate(0deg) scale(1); }
          }

          .geo-animate {
            animation: floatMove 6s ease-in-out infinite;
          }

          .glow-stroke polygon {
            stroke: url(#grad) !important;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: rgba(255, 255, 255, 0.05);
            filter: drop-shadow(0px 0px 8px rgba(0,0,0,0.08));
          }
        `}
      </style>

      {/* ===== GEOMETRIC PATTERNS ===== */}
     {/* ===== GEOMETRIC PATTERNS (EXPANDED) ===== */}
<div className="absolute left-0 top-10 opacity-30 pointer-events-none hidden lg:block geo-animate">
  <GeoPattern size={220} />
</div>

<div className="absolute left-24 top-1/2 opacity-20 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "1.5s" }}>
  <GeoPattern size={150} />
</div>

<div className="absolute left-0 bottom-10 opacity-25 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "2s" }}>
  <GeoPattern size={180} />
</div>

<div className="absolute left-1/4 bottom-28 opacity-15 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "0.8s" }}>
  <GeoPattern size={120} />
</div>


{/* RIGHT SIDE */}
<div className="absolute right-0 top-20 opacity-28 pointer-events-none hidden lg:block geo-animate">
  <GeoPattern size={230} />
</div>

<div className="absolute right-32 top-1/3 opacity-18 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "1.2s" }}>
  <GeoPattern size={160} />
</div>

<div className="absolute right-28 bottom-20 opacity-20 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "2.5s" }}>
  <GeoPattern size={190} />
</div>

<div className="absolute right-1/4 bottom-10 opacity-12 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "0.5s" }}>
  <GeoPattern size={130} />
</div>


{/* TOP + CENTER FLOATERS */}
<div className="absolute left-1/3 top-5 opacity-24 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "1s" }}>
  <GeoPattern size={100} />
</div>

<div className="absolute right-1/3 top-10 opacity-24 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "1.8s" }}>
  <GeoPattern size={110} />
</div>

<div className="absolute left-1/2 top-1/2 opacity-24 pointer-events-none hidden lg:block geo-animate" style={{ animationDelay: "2.8s" }}>
  <GeoPattern size={90} />
</div>


      {/* MAIN GRID CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[40%_25%_35%] gap-6 px-4">
        {/* TEXT */}
        <div className="order-1 lg:order-3 flex flex-col justify-center lg:pr-10">
          <h1 className="text-[48px] sm:text-[60px] lg:text-[55px] font-serif text-[#2d2926] leading-none mb-6 lg:mb-10">
             {room.title}
          </h1>

          <p className="text-[#2d2926] leading-7 mb-10 lg:mb-12 max-w-[500px]">
           {room.description}
          </p>

          <div className="flex lg:justify-end">
            <Link href="/detailspage">
              <button className="flex items-center gap-3 bg-[#bea64c] px-5 py-2 rounded-md text-sm text-[#2d2926]">
                See all Room options
                <span className="w-6 h-6 flex items-center justify-center border border-[#2d2926] rounded-full">
                  →
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* BIG IMAGE */}
        <div className="order-2 lg:order-1 relative h-[380px] sm:h-[450px] lg:h-[620px] w-full overflow-hidden">
         <Link href="/resturantdetailspage">
          <Image
             src={room.bigImage}
            alt="big"
            fill
            className="object-cover animate-zoom-move"
          /></Link>
        </div>

        {/* SMALL IMAGE */}
        <div className="order-3 lg:order-2 relative h-[300px] sm:h-[350px] lg:h-[380px] w-full lg:w-[300px] overflow-hidden lg:top-[300px]">
          <Link href="/resturantdetailspage">
          <Image
            src={room.smallImage}
            alt="small"
            fill
            className="object-cover animate-zoom-move"
          />
</Link>
         
        </div>
      </div>
    </div>
  );
}

/* ===== MODERN GEOMETRIC SHAPE COMPONENT ===== */
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
