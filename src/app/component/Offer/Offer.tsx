"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const offers = [
  {
    id: 1,
    img: "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    title: "For every you. For every stay. Members always save.",
    button: "Discover more",
  },
  {
    id: 2,
    img: "https://i.ibb.co.com/DPXR710Y/hotel3.jpg",
    title: "Upgrade your travel with ALL Accor+ Explorer privileges",
    button: "Become an Explorer",
  },
  {
    id: 3,
    img: "https://i.ibb.co.com/XfkhP8KH/hotel1.jpg",
    title: "Discover our top 20 favourite hotels from seaside to city",
    button: "Book your perfect escape",
  },
  {
    id: 4,
    img: "https://i.ibb.co.com/rR14fWYW/hotel4.jpg",
    title: "Exclusive offers for members and frequent travelers",
    button: "Join now",
  },
];

export default function OffersSection() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/detailspage");
  };

  return (
    <section className="px-4 py-12 -mt-5 bg-[#0f3333]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-[#F8F8F2] mb-8">Our Rooms</h2>

        <div className="grid md:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <div
  key={offer.id}
  className="relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
  onClick={handleCardClick}
>
  {/* Background Image */}
  <Image
    src={offer.img}
    alt={offer.title}
    width={600}
    height={400}
    className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
  />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

  {/* ❗ Text bubble moved to bottom */}
  <div className="absolute bottom-4 left-4 max-w-[85%]">
    <div className="relative inline-block px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/50 shadow-md">
      <p className="text-[#F8F8F2] font-semibold text-sm leading-snug">
        {offer.title}
      </p>
    </div>
  </div>

  {/* ❌ Button removed */}
</div>

          ))}
        </div>
      </div>
    </section>
  );
}
