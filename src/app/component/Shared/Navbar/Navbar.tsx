"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "../../LanguageSwitcher/LanguageSwitcher";
import MobileLanguageSwitcher from "../../LanguageSwitcher/MobileLanguage";
interface NavbarProps {
  user: { photoURL: string };
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  userLogOut: () => void;
}
interface RoomData {
  _id: string;
  heroImage: string;
  roomshorttile?: string;
  roomsdata?: {
    id: string;
    title: string;
    carouselImages?: string[];
    herotext?: string;
  }[];
}

interface MenuItem {
  title: string;       // "Room", "Dining", etc
  href: string;        // link for left menu
  data: RoomData[];    // items under this menu
}

export default function Navbar({
 
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("");
  const [showSecond, setShowSecond] = useState(false);
  

   const pathname = usePathname();
  const isHome = pathname === "/";
  
  // Mobile dropdown
  const [mobileDropdown, setMobileDropdown] = useState(false);
 // Add these states at top:
const [openLang, setOpenLang] = useState(false);
const hoverTimer = useRef<number | null>(null);

  const languages = ["English", "Bangla", "Hindi", "Chinese", "Japanese"];

  const panelRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//   if (!isHome) {
//     setShowSecond(true);
//     return;
//   }

//   const handleScroll = () => {
//     setShowSecond(window.scrollY > 450);
//   };

//   window.addEventListener("scroll", handleScroll);
//   return () => window.removeEventListener("scroll", handleScroll);
// }, [isHome]);

const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

useEffect(() => {
  async function loadMenu() {
    const [roomsRes, restaurantsRes, bouquetRes, fitnessRes] = await Promise.all([
      fetch("https://nascent.virtualshopbd.com/api/rooms").then((r) => r.json()),
      fetch("https://nascent.virtualshopbd.com/api/restaurants").then((r) => r.json()),
      fetch("https://nascent.virtualshopbd.com/api/bouquet").then((r) => r.json()),
      fetch("https://nascent.virtualshopbd.com/api/fitness").then((r) => r.json()),
    ]);

    setMenuItems([
      {
        title: "Accommodation",
        href: "/detailspage",
        data: roomsRes.data || [],
      },
      {
        title: "Dining",
        href: "/resturantdetailspage",
        data: restaurantsRes.data || [],
      },
      {
        title: "Bouquet",
        href: "/bouquet",
        data: bouquetRes.data || [],
      },
      {
        title: "Fitness",
        href: "/fitness",
        data: fitnessRes.data || [],
      },
    ]);
  }

  loadMenu();
}, []);
  // Scroll detection (large device only)
 useEffect(() => {
  setOpen(false);
  setActiveContent("");
  setMobileDropdown(false);
}, [pathname]);


// Scroll detection + Stage-2
useEffect(() => {
  if (!isHome) {
    setShowSecond(true);
    return;
  }

  const handleScroll = () => {
    const width = window.innerWidth;

    // Medium devices / laptop
    const scrollThreshold = width <= 1380 ? 450 : 730;

    const scrolled = window.scrollY > scrollThreshold;

    setShowSecond(prev => {
      if (prev !== scrolled) {
        setMobileDropdown(false);
        setActiveContent("");
        return scrolled;
      }
      return prev;
    });
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [isHome]);



  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !target.closest(".menu-item")
      ) {
        setActiveContent("");
      }
    };

    if (activeContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [activeContent]);

  // const menuItems = [
  //   {
  //     title: "Room",
  //     content: "Enjoy luxurious.",
  //     image:
  //       "https://www.mampei.co.jp/wp-content/uploads/2024/07/alps_classic_gallery01.jpg"
  //   },
  //   {
  //     title: "Gym",
  //     content: "State-of-the-art",
  //     image:
  //       "https://secure.peninsula.com/shs-ngbe-image-resizer/images/hotel/12625/images/xlarge/room/loft-living_room_1400_bundle.jpg"
  //   },
  //   {
  //     title: "Kitchen",
  //     content: "Explore our",
  //     image:
  //       "https://secure.peninsula.com/shs-ngbe-image-resizer/images/hotel/12625/images/xlarge/room/loft-living_room_1400_bundle.jpg"
  //   },
  //   // {
  //   //   title: "Spa",
  //   //   content: "Relax spa.",
  //   //   image:
  //   //     "https://secure.peninsula.com/shs-ngbe-image-resizer/images/hotel/12625/images/xlarge/room/loft-living_room_1400_bundle.jpg"
  //   // },
  //   // {
  //   //   title: "Swimming Pool",
  //   //   content: "Dive into",
  //   //   image:
  //   //     "https://secure.peninsula.com/shs-ngbe-image-resizer/images/hotel/12625/images/xlarge/room/loft-living_room_1400_bundle.jpg"
  //   // }
  // ];

  return (
    <>
    {/* --------------------------- STAGE-1 NAVBAR --------------------------- */}
{isHome && !showSecond && (
  <header className="fixed top-9 left-0 w-full border-black-30 z-[999] border-b border-transparent transition-all">
    <div className="w-[92%] mx-auto flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-5">
        <Menu
          size={28}
          className="cursor-pointer text-white md:hidden"
          onClick={() => setMobileDropdown(!mobileDropdown)}
        />

        <Menu
          size={40}
          className="cursor-pointer text-[#F8F8F2] text-xl hidden md:block"
          onClick={() => setOpen(true)}
        />

      <Link href="/">
        <Image
  src="https://i.ibb.co.com/nM82NyjS/NG-LOGO-BARIDHARA-icon.png"
  alt="logo"
  width={200}        // increase actual width
  height={200}       // increase actual height
  className="object-contain w-[70px] md:w-[90px] h-auto"
/></Link>

      </div>

      {/* ⭐ MOBILE RIGHT SIDE Book Stay Button */}
      <div
    className="relative"
    onMouseEnter={() => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      setOpenLang(true);
    }}
    onMouseLeave={() => {
      hoverTimer.current = window.setTimeout(() => {
        setOpenLang(false);
      }, 300); // 300ms delay for smooth hover
    }}
  >
    {/* Button */}
   <div className="md:hidden block">
    <MobileLanguageSwitcher />
   </div>
  </div>

      {/* RIGHT (Desktop only) */}
  <div className="hidden md:flex items-center gap-6 text-white text-[15px] font-medium relative">
 {/* <LanguageSwitcher/> */}
    {/* <Link href="/nearlocation">
      <p className="hover:text-yellow-400 text-[#F8F8F2] text-xl font-bold cursor-pointer">Reach Us</p></Link> */}

      {/* Hover + Click Friendly Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => {
          if (hoverTimer.current) clearTimeout(hoverTimer.current);
          setOpenLang(true);
        }}
        onMouseLeave={() => {
          hoverTimer.current = window.setTimeout(() => {
            setOpenLang(false);
          }, 300); // 300ms delay for smooth hover
        }}
      >
        {/* Button */}
         <LanguageSwitcher/>
        {/* <button
          onClick={() => setOpenLang(!openLang)}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#F8F8F2] text-black font-semibold hover:bg-green-300 transition"
        >
          Language00
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              openLang ? "rotate-180" : "rotate-0"
            }`}
          />
        </button> */}

        {/* Dropdown Menu */}
        {/* <div
          className={`absolute right-0 mt-2 w-44 bg-white text-black rounded-xl shadow-xl py-2 z-50 transition-all duration-300 ${
            openLang
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {languages.map((lang) => (
            <p
              key={lang}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
              onClick={() => {
                console.log("Selected:", lang);
                setOpenLang(false);
              }}
            >
              {lang}
            </p>
          ))}
        </div> */}
      </div>
    </div>

    </div>

   {/* Mobile Dropdown */}
<div
  className={`md:hidden overflow-hidden bg-black/60 backdrop-blur-md transition-all duration-500 ${
    mobileDropdown ? "max-h-[1000px] py-4" : "max-h-0"
  }`}
>
  <div className="flex flex-col text-[#F8F8F2] text-lg px-6 space-y-4 font-medium">
    {menuItems.map((item) => {
      const firstSubItem = item.data[0]; // Take the first item in the data array
      const firstImage =
        firstSubItem?.roomsdata?.[0]?.carouselImages?.[0] ||
        firstSubItem?.heroImage ||
        "";
      const displayTitle =
        firstSubItem?.roomsdata?.[0]?.title ||
        firstSubItem?.roomshorttile ||
        firstSubItem?._id ||
        "";

      return (
        <div key={item.title} className="border-b border-white/20 pb-3">
          {/* Header Section */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() =>
              setActiveContent(activeContent === item.title ? "" : item.title)
            }
          >
            <p>{item.title}</p>
            <ChevronRight
              className={`transition-transform duration-300 ${
                activeContent === item.title ? "rotate-90" : ""
              }`}
            />
          </div>

          {/* Dropdown Content */}
          {activeContent === item.title && firstSubItem && firstImage && (
            <div className="bg-black/70 p-4 rounded-lg mt-3">
              <Image
                src={firstImage}
                width={200}
                height={150}
                alt={displayTitle}
                className="rounded-lg w-full object-cover mb-3"
              />
              <p className="text-gray-300">{displayTitle}</p>
            </div>
          )}
        </div>
      );
    })}

    {/* Bottom Links */}
    <div className="ms-1 mt-3 flex flex-col space-y-2">
      <Link href="/aboutus" className="hover:text-yellow-400">
        About Us
      </Link>
      <Link href="/whatsnew" className="hover:text-yellow-400">
        Whats New
      </Link>
      <Link href="/contactus" className="hover:text-yellow-400">
        Connect
      </Link>
      <Link href="/nearlocation" className="hover:text-yellow-400">
        Reach Us
      </Link>
    </div>
  </div>
</div>

  </header>
)}


{/* --------------------------- STAGE-2 NAVBAR --------------------------- */}
{showSecond && (
  <header
    className={`fixed top-0 left-0 navbar w-full bg-gradient-to-b   from-[#0c0c0c] via-[#0f3333] to-[#0f3333] text-[#F8F8F2] border-b border-gray-800 shadow-md z-50 py-3
      transition-all duration-700
      ${showSecond ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
    `}
  >
    <div className="w-[95%] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-5">
        <Menu
          size={28}
          className="cursor-pointer md:hidden"
          onClick={() => setMobileDropdown(!mobileDropdown)}
        />

        <Menu
          size={40}
          className="cursor-pointer hidden md:block"
          onClick={() => setOpen(true)}
        />

      <Link href="/">
       <Image
  src="https://i.ibb.co.com/nM82NyjS/NG-LOGO-BARIDHARA-icon.png"
  alt="logo"
  width={200}        
  height={200}       
  className="object-contain w-[70px] md:w-[70px] h-auto"
/></Link>
 
      </div>

      {/* Desktop Menu */}
     <div className="hidden md:flex items-center gap-8 text-[14px] font-semibold">
  {[
    { name: "Accommodation", href: "/detailspage" },
    { name: "Dining", href: "/resturantdetailspage" },
    { name: "Bouquet", href: "/bouquet" },
    { name: "Fitness", href: "/fitness" },
    { name: "Gallery", href: "/gallery" },
    { name: "OFFERS", href: "/specialoffer" },
    { name: "Connect", href: "/contactus" },
  ].map((item) => (
    <Link key={item.name} href={item.href} className="cursor-pointer hover:text-yellow-400">
      {item.name}
    </Link>
  ))}
</div>



      {/* Desktop Book Button */}
   <div className="flex items-center gap-4">

   <div className="md:block hidden">
     <LanguageSwitcher/>
   </div>
 {/* <Link href="/nearlocation">
  <p className="hover:text-yellow-400 text-[#F8F8F2] text-xl hidden md:block font-bold cursor-pointer">
    Reach Us00
  </p></Link> */}

  {/* Hover + Click Friendly Dropdown */}
  <div
    className="relative"
    onMouseEnter={() => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      setOpenLang(true);
    }}
    onMouseLeave={() => {
      hoverTimer.current = window.setTimeout(() => {
        setOpenLang(false);
      }, 300); // 300ms delay for smooth hover
    }}
  >
    {/* Button */}
 <div className="md:hidden block absolute left-1 top-1/2 -translate-y-1/2">
    <MobileLanguageSwitcher />
  </div>
    {/* <LanguageSwitcher/> */}
    {/* <button
      onClick={() => setOpenLang(!openLang)}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#F8F8F2] text-black font-semibold hover:bg-green-300 transition"
    >
      Language99
      <ChevronDown
        size={18}
        className={`transition-transform duration-300 ${
          openLang ? "rotate-180" : "rotate-0"
        }`}
      />
    </button> */}

    {/* Dropdown Menu */}
    {/* <div
      className={`absolute right-0 mt-2 w-44 bg-white text-black rounded-xl shadow-xl py-2 z-50 transition-all duration-300 ${
        openLang
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      {languages.map((lang) => (
        <p
          key={lang}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
          onClick={() => {
            console.log("Selected:", lang);
            setOpenLang(false);
          }}
        >
          {lang}
        </p>
      ))}
    </div> */}
  </div>
</div>


      {/* ✅ MOBILE RIGHT-SIDE BOOK BUTTON ADDED HERE */}
      <button className="md:hidden px-4 py-2  font-semibold rounded-full">
       
      </button>
    </div>
  </header>
)}

{/* --------------------------- Mobile Dropdown (Stage-2 Same) --------------------------- */}
{/* --------------------------- Stage-2 Mobile Dropdown --------------------------- */}
{showSecond && (
  <div className="md:hidden">
    {/* Mobile Dropdown Button */}
    <div className="flex justify-between items-center px-6 py-3 bg-[#0f3333]">
      <Menu
        size={28}
        className="cursor-pointer text-white"
        onClick={() => setMobileDropdown(!mobileDropdown)}
      />
      <Link href="/">
        <Image
          src="https://i.ibb.co.com/svhxtPX2/NG-LOGO-BARIDHARA-icon.png"
          alt="logo"
          width={70}
          height={70}
          className="object-contain w-[70px] h-auto"
        />
      </Link>
    </div>

    {/* Mobile Dropdown Container */}
   {/* Mobile Dropdown Container */}
<div
  className={`overflow-hidden bg-black/60 backdrop-blur-md transition-all duration-500 ${
    mobileDropdown ? "max-h-[1500px] py-4" : "max-h-0"
  }`}
>
  <div className="flex flex-col text-[#F8F8F2] text-lg px-6 space-y-4 font-medium">
    {menuItems.map((item) => {
      const firstSubItem = item.data[0]; // take first item from data
      const firstImage =
        firstSubItem?.roomsdata?.[0]?.carouselImages?.[0] ||
        firstSubItem?.heroImage ||
        "";
      const displayTitle =
        firstSubItem?.roomsdata?.[0]?.title ||
        firstSubItem?.roomshorttile ||
        firstSubItem?._id ||
        "";

      return (
        <div key={item.title} className="border-b border-white/20 pb-3">
          {/* Header */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() =>
              setActiveContent(activeContent === item.title ? "" : item.title)
            }
          >
            <p>{item.title}</p>
            <ChevronRight
              className={`transition-transform duration-300 ${
                activeContent === item.title ? "rotate-90" : ""
              }`}
            />
          </div>

          {/* Dropdown Content */}
          {activeContent === item.title && firstSubItem && firstImage && (
            <div className="bg-black/70 p-4 rounded-lg mt-3">
              <Image
                src={firstImage}
                width={400}
                height={250}
                alt={displayTitle}
                className="rounded-lg w-full object-cover mb-3"
              />
              <p className="text-gray-300">{displayTitle}</p>
            </div>
          )}
        </div>
      );
    })}

    {/* Bottom Links */}
    <div className="flex flex-col space-y-2 mt-3">
      <Link href="/aboutus" className="hover:text-yellow-400">
        About Us
      </Link>
      <Link href="/whatsnew" className="hover:text-yellow-400">
        Whats New
      </Link>
      <Link href="/contactus" className="hover:text-yellow-400">
        Connect
      </Link>
      <Link href="/nearlocation" className="hover:text-yellow-400">
        Reach Us
      </Link>
    </div>
  </div>
</div>

  </div>
)}



{/* hhhhhh */}

      {/* --------------------------- Desktop Sidebar --------------------------- */}
      <aside
       className={`fixed top-0 left-0 h-full w-72 bg-[#0f3333]
  transform ${open ? "translate-x-0" : "-translate-x-full"}
  transition-transform duration-500 z-[2001] hidden md:block`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <h2 className="text-lg text-white">Menu</h2>
          <X size={22} className="cursor-pointer" onClick={() => setOpen(false)} />
        </div>

       <nav className="flex flex-col mt-6 space-y-2 text-[16px] text-white font-medium relative">
  {/* {menuItems.map((item) => (
    <div
      key={item.title}
      className="menu-item flex justify-between items-center cursor-pointer hover:bg-gray-800 px-3 py-2"
      onMouseEnter={() => setActiveContent(item.title)}
      onMouseLeave={() => setActiveContent("")}
    >
      {item.title}

      <ChevronRight size={20} />
    </div>
  ))} */}
   {menuItems.map((item) => (
    <div
      key={item.title}
      className="menu-item mt-6 flex justify-between items-center cursor-pointer hover:bg-gray-800 px-3 py-2"
      onMouseEnter={() => setActiveContent(item.title)}
      onMouseLeave={() => setActiveContent("")}
    >
      {item.title}
      <ChevronRight size={20} />
    </div>
  ))}

 <div className="ms-3 mt-3">
   <Link href="/aboutus">About Us</Link>
 </div>
 <div className="ms-3 mt-3">
   <Link href="/whatsnew">Whats New</Link>
 </div>
 <div className="ms-3 mt-3">
   <Link href="/contactus" className="hover:text-yellow-400">
        Connect
      </Link>
 </div>
 

  {/* RIGHT SIDE PANEL WITH SMOOTH ANIMATION */}

 <div
  ref={panelRef}
  className={`fixed left-72 top-0 h-full w-[400px] bg-[#0f3333] p-6 shadow-2xl 
    transition-all duration-500 ease-in-out
    ${activeContent ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}
  `}
  onMouseEnter={() => setActiveContent(activeContent)}
  onMouseLeave={() => setActiveContent("")}
>
  {/* Wrapper div for margin-top */}
  <div className="mt-20">
    {activeContent &&
      menuItems
        .filter((m) => m.title === activeContent)
        .map((item) =>
          item.data.map((subItem) => {
            // Pick the first image safely
            const firstImage =
              subItem.roomsdata?.[0]?.carouselImages?.[0] || subItem.heroImage || null;

            const displayTitle =
              subItem.roomsdata?.[0]?.title || subItem.roomshorttile || subItem._id;

            return (
              <Link
                href={item.href}
                key={subItem._id}
                className="flex items-center cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition"
              >
                {/* Left Image: only render if firstImage exists */}
                {firstImage && (
                  <div className="w-[120px] h-[80px] flex-shrink-0">
                    <Image
                      src={firstImage}
                      width={120}
                      height={80}
                      alt={displayTitle}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                )}

                {/* Right Title */}
                <div className={`ml-4 flex-1 ${!firstImage ? "ml-0" : ""}`}>
                  <h3 className="text-white font-semibold text-lg">{displayTitle}</h3>
                  {subItem.roomsdata?.[0]?.herotext && (
                    <p className="text-gray-300 text-sm">
                      {subItem.roomsdata[0].herotext}
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
  </div>
</div>

 



</nav>

      </aside>

      {/* Overlay for Desktop */}
     {open && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm
    z-[1000] hidden md:block"
    onClick={() => setOpen(false)}
  />
)}

    </>
  );
}
