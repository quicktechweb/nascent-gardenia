"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

/* 🏨 Offers Data Type */
interface Offer {
  _id: string;
  title: string;
  subtitle: string;
  desc: string;
  button: string;
  image: string;
}

export default function SpecialOffer() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH FROM DB =================
  const fetchOffers = async () => {
    try {
      const res = await axios.get<Offer[]>(
        "https://nascent.virtualshopbd.com/api/specialoffer"
      );
      setOffers(res.data);
    } catch (err) {
      console.error("Failed to fetch offers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b md:px-28 from-[#0f3333] via-[#0c0c0c] to-black py-24 overflow-hidden">
      {/* Animated radial background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-2">
            • SPECIAL DEALS •
          </p>
          <h2 className="text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.25)]">
            Exclusive <span className="text-yellow-400">Offers</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Experience luxury like never before with our exclusive,
            time-limited packages and perks.
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <p className="text-center text-gray-400">Loading offers...</p>
        )}

        {/* ================= OFFERS GRID ================= */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-2 justify-center">
            {offers.map((offer) => (
              <FloatingCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ✨ Floating Tilt Card */
function FloatingCard({ offer }: { offer: Offer }) {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      scale={1.03}
      transitionSpeed={1500}
      glareEnable
      glareMaxOpacity={0.25}
      glareColor="#FFD700"
      glarePosition="all"
    >
      <motion.div
        whileHover={{ y: -5, scale: 1.03 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-[350px] bg-gradient-to-br from-[#181818] to-[#222]
                   border border-yellow-400/10 rounded-2xl overflow-hidden
                   shadow-[0_0_15px_rgba(255,215,0,0.1)]
                   hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]
                   transition-all duration-500 relative mx-auto"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={offer.image}
            alt={offer.title}
            width={400}
            height={270}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-lg font-bold text-white">{offer.title}</h3>
            <p className="text-sm text-gray-300">{offer.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col justify-between h-[calc(100%-11rem)]">
          <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-3">
            {offer.desc}
          </p>

          <motion.a
            whileHover={{
              scale: 1.06,
              backgroundColor: "#FFD700",
              color: "#000",
            }}
            href="#"
            className="inline-block text-center bg-[#101010] text-white
                       font-semibold py-2.5 rounded-full
                       border border-yellow-400/30
                       hover:shadow-[0_0_10px_rgba(255,215,0,0.5)]
                       transition-all duration-300 text-sm"
          >
            {offer.button}
          </motion.a>
        </div>

        {/* Glow Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border border-yellow-400/0"
          animate={{
            borderColor: [
              "rgba(255,215,0,0.08)",
              "rgba(255,215,0,0.25)",
              "rgba(255,215,0,0.08)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </Tilt>
  );
}
