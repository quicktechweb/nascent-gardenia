"use client";

import { useEffect, useState } from "react";
import { AiOutlineDoubleRight } from "react-icons/ai";

// ✅ Room type define
type Room = {
  _id: string;
  title: string;
  description: string;
  features: string[];
};

export default function RoomInfoSection() {
  // ✅ type explicitly set
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch("https://nascent.virtualshopbd.com/api/features");
        const data = await res.json();

        if (data?.rooms?.length > 0) {
          setRoom(data.rooms[0]);
        }
      } catch (error) {
        console.error("Failed to fetch room info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-16 bg-[#0f3333] text-center text-gray-200">
        Loading...
      </section>
    );
  }

  if (!room) return null;

  return (
    <section className="px-4 py-16 bg-[#0f3333]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* STATIC HEADER */}
        <h2
          className="text-[#c78436] text-4xl md:text-6xl font-semibold mb-14 
                     text-center uppercase
                     drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]"
          style={{
            fontFamily: "Trajan Pro, Cinzel, 'Times New Roman', serif",
          }}
        >
          NASCENT GARDENIA BARIDHARA
        </h2>

        {/* MAIN WRAPPER */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-14 text-center md:text-left w-full">

          {/* LEFT SIDE */}
          <div className="space-y-4 md:space-y-6 max-w-md">
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-wide">
              {room.title}
            </h3>

            <p className="text-gray-200 text-base md:text-lg leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <ul className="space-y-6 text-base md:text-lg max-w-md">
            {room.features.map((item, i) => (
              <li
                key={i}
                className="flex items-start justify-center md:justify-start gap-4"
              >
                <AiOutlineDoubleRight className="text-[#c78436] text-xl mt-1 flex-shrink-0" />
                <p className="text-gray-200 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}
