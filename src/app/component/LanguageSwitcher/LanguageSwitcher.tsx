"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "hi", label: "हिंदी" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageSwitcher() {
  const [ready, setReady] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        setReady(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      setOpenLang(false);
    }
  };

  if (!ready) return null;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setOpenLang(true);
      }}
      onMouseLeave={() => {
        hoverTimer.current = window.setTimeout(() => {
          setOpenLang(false);
        }, 300); // smooth close delay
      }}
    >
      {/* Button */}
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-full
        bg-[#F8F8F2] text-black font-semibold
        hover:bg-green-300 transition-colors duration-300"
      >
        Language
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ease-out ${
            openLang ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Hover-safe dropdown wrapper */}
      <div className="absolute right-0 mt-1 ">
        {/* Dropdown */}
        <div
          className={`w-44 bg-white text-black rounded-2xl shadow-xl py-2 z-50
          transition-all duration-300 ease-out origin-top
          ${
            openLang
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full text-left px-4 py-2 text-sm
              hover:bg-green-100 transition-colors duration-200"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
