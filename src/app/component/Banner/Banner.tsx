"use client";
import React, { useState, useEffect } from "react";

// React Icons
import { FaCompass, FaHotel} from "react-icons/fa";
import { GiIsland, GiLotus } from "react-icons/gi";
import { MdDinnerDining, MdFestival } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface Video {
  _id: string;
  url: string;
  createdAt?: string;
}

interface MobileMenuItem {
  icon: React.ReactNode;
  label: string;
  link: string; // required
}

// const videoURL =
//   "https://www.youtube.com/embed/-L8rE3WNCE0?autoplay=1&mute=1&loop=1&playlist=-L8rE3WNCE0&controls=0&modestbranding=1&showinfo=0&rel=0&playsinline=1&vq=hd1080";

export default function Banner() {
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
   const [videos, setVideos] = useState<Video[]>([]);
  const [videoURL, setVideoURL] = useState<string>("");
  

  useEffect(() => {
    fetchVideos();
  }, []);

 const fetchVideos = async () => {
    try {
      const res = await axios.get("https://nascent.virtualshopbd.com/api/banner/videos");

      if (res.data.success) {
        const fetchedVideos = res.data.videos as Video[];
        setVideos(fetchedVideos);

        // ✅ set first video URL
        setVideoURL(fetchedVideos[0]?.url || "");
      }
    } catch (err) {
      console.error("Fetch videos error:", err);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const videoRatio = 16 / 9;
      const windowRatio = w / h;

      setScale(
        windowRatio > videoRatio
          ? windowRatio / videoRatio
          : videoRatio / windowRatio
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 const menuItems = [
  { icon: <FaHotel size={28} />, label: "Accommodation", link: "/detailspage" },
  { icon: <GiIsland size={30} />, label: "Dining", link: "/resturantdetailspage" },
  { icon: <MdFestival size={32} />, label: "Bouquet", link: "/bouquet" },
  { icon: <IoHome size={30} />, label: "Fitness", link: "/fitness" },
  { icon: <MdDinnerDining size={30} />, label: "Gallery", link: "/gallery" },
  { icon: <FaCompass size={30} />, label: "Connect", link: "/contactus" },
];


const mobileItems: MobileMenuItem[] = menuItems.map((item) => ({
  icon: React.cloneElement(item.icon, { size: 26 }),
  label: item.label.length > 6 ? item.label.slice(0, 6) : item.label,
  link: item.link,
}));
  

  return (
    <section className="relative w-full h-[95vh] overflow-hidden bg-black">

      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 animate-kenburns"
          style={{
            width: "100vw",
            height: "56.25vw",
            minHeight: "100vh",
            minWidth: "177.78vh",
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
        {videoURL ? (
        <iframe
          src={videoURL}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <p className="absolute inset-0 flex items-center justify-center text-gray-400">
          No video available
        </p>
      )}
        </div>
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* VIDEO BOTTOM FADE */}
      <div
        className="absolute bottom-0 left-0 w-full h-40 md:h-60 pointer-events-none z-20"
        style={{
          background:
             "linear-gradient(to top, #0f3333 0%, rgba(15,51,51,0.7) 35%, rgba(15,51,51,0) 100%)",
        }}
      ></div>

      {/* CENTER LOGO */}
     <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
  <Image
    src="https://i.ibb.co.com/nM82NyjS/NG-LOGO-BARIDHARA-icon.png"
    alt="Mandarin Logo"
    width={160}
    height={160}
    className="opacity-20 bg-transparent"
    style={{
      filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.15)) blur(1px)",
    }}
  />
</div>


      {/* BOTTOM ICON MENU */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-full px-3">

        {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-20 text-white justify-center relative z-20">
  {menuItems.map((item, idx) => (
    <Link key={idx} href={item.link}>
      <MenuItem icon={item.icon} label={item.label} />
    </Link>
  ))}
</div>

        {/* MOBILE MENU (3 per row scroll) */}
        <div className="md:hidden w-full overflow-x-auto scrollbar-hide pb-3 relative z-20">
          <div className="flex gap-3 px-2" style={{ scrollSnapType: "x mandatory" }}>
        {mobileItems.map((item, idx) => 
  item.link ? (
    <div
      key={idx}
      className="flex-none flex justify-center scrollSnapItem"
      style={{
        scrollSnapAlign: "start",
        width: `calc((100% - 2 * 0.75rem) / 3)`,
      }}
    >
      <Link href={item.link}>
        <MenuItem icon={item.icon} label={item.label} />
      </Link>
    </div>
  ) : null
)}


          </div>
        </div>

      </div>
    </section>
  );
}

/* ICON + TEXT COMPONENT */
function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 group cursor-pointer">
      <div className="text-[#F8F8F2] opacity-90 group-hover:opacity-100 transition">
        {icon}
      </div>
      <span className="text-xs text-[#F8F8F2] tracking-wide font-semibold group-hover:text-white/80">
        {label}
      </span>
    </div>
  );
}
