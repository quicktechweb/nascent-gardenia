"use client";
import { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

interface ReservationsButtonProps {
  onClick: () => void;
}

const ReservationsButton = ({ onClick }: ReservationsButtonProps) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      setIsScrolling(true);

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={onClick}
        style={{
          background: isScrolling
            ? "rgba(199, 132, 54, 0.45)"
            : "rgba(199, 132, 54, 0.20)",

          border: "1.5px solid rgba(199, 132, 54, 0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: isScrolling
            ? "0 0 18px rgba(199, 132, 54, 0.6)"
            : "0 0 12px rgba(199, 132, 54, 0.45)",

          transition: "all 0.3s ease",
        }}
        className="px-8 py-3 rounded-full text-white shadow-lg flex items-center gap-2 hover:scale-110 transition-all"
      >
        <FaRegCalendarAlt className="text-xl" /> Reservations
      </button>
    </div>
  );
};

export default ReservationsButton;
