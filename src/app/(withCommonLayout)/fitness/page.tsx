"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, useScroll } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import axios from "axios";
import { useViewportScroll, useTransform,useSpring  } from "framer-motion";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface RoomLayout {
  onClick: () => void;
}

interface BasicInfo {
  bedType: string;
  size: string;
  capacity: number;
  numberOfRooms: number;
  bedSize: string;
  floorInformation: string;
  view: string;
  checkinOut: string;
  extraBed: string;
  connectingRoom: string;
}

interface Room {
  id: string;
  title: string;
  roomType: string;
  bgColor: string;
  description: string;
  carouselImages: string[];
  facilities: string[];
  floorPlanImage: string;
  basicInfo: BasicInfo;
  availableDates: { start: string; end: string }[];
}

interface ApiRoomData {
  _id: string;
  heroImage: string;
  roomheader: string;
  herotext: string;
  roomshortdescription: string;
  herodescription: string;
  roomshorttile: string;
  roomsdata: Room[];
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: ApiRoomData[];
}

export default function RoomLayout({ onClick }: RoomLayout) {

 
 const router = useRouter();
 
const [showModal, setShowModal] = useState(false);

  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<
    "initial" | "roomType" | "services"
  >("initial");
  

  const roomRefs = useRef<HTMLDivElement[]>([]);
  const carouselRefs = useRef<HTMLDivElement[]>([]);

   const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [useSingleDate, setUseSingleDate] = useState(true);
  const [nights, setNights] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(1);
   const [roomsdata, setRoomsdata] = useState<Room[]>([]);
  const [heroImage, setHeroImage] = useState<string>("");
  const [roomheader, setRoomheader] = useState<string>("");
  const [herotext, setherotext] = useState<string>("");
  const [roomshortdescription, setroomshortdescription] = useState<string>("");
  const [herodescription, setherodescription] = useState<string>("");
  const [roomshorttile, setroomshorttile] = useState<string>("");
    // const [filteredRooms, setFilteredRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

    const [roomType, setRoomType] = useState(""); // modal এ auto-set type



  
 const handleSearch = () => {
  if (!arrival || (!useSingleDate && !departure)) {
    alert("Please select the required date(s)!");
    return;
  }
  
};


  const [windowWidth, setWindowWidth] = useState(0);

  
const [showReservation, setShowReservation] = useState(false);

 const normalizeDate = (date: string) => {
    if (!date) return "";
    if (date.includes("/")) {
      const [dd, mm, yyyy] = date.split("/");
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }
    return date;
  };

  const toNum = (date: string) => new Date(date).getTime();

 

useEffect(() => {
  const handleScroll = () => {
    const bannerHeight = 700; // height of your hero/banner in px (adjust if needed)
    if (window.scrollY > bannerHeight) {
      setShowReservation(true);
    } else {
      setShowReservation(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


useEffect(() => {
  setWindowWidth(window.innerWidth); // only runs on client
}, []);
  // Fetch rooms from API
 useEffect(() => {
  const fetchRooms = async () => {
    try {
      const res = await axios.get<ApiResponse>("https://nascent.virtualshopbd.com/api/fitness");

      // Flatten all rooms from all data objects
      const allRooms: Room[] = res.data.data.flatMap(item => item.roomsdata);

      setRoomsdata(allRooms);

      // Optional: Set heroImage to first item’s hero
      if (res.data.data.length > 0) {
        setHeroImage(res.data.data[0].heroImage);
      }
      if (res.data.data.length > 0) {
        setRoomheader(res.data.data[0].roomheader);
      }
      if (res.data.data.length > 0) {
        setherotext(res.data.data[0].herotext);
      }
      if (res.data.data.length > 0) {
        setroomshorttile(res.data.data[0].roomshorttile);
      }
      if (res.data.data.length > 0) {
        setroomshortdescription(res.data.data[0].roomshortdescription);
      }
      if (res.data.data.length > 0) {
        setherodescription(res.data.data[0].herodescription);
      }
      
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };
  fetchRooms();
}, []);



  const halfReveal: Variants = {
    hidden: { opacity: 0, y: 80, scale: 0.95, clipPath: "inset(40% 0% 0% 0%)", filter: "blur(6px)" },
    show: { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] } }
  };


  useEffect(() => {
    if (!arrival || roomsdata.length === 0) return;

    const startNum = toNum(arrival);
    const endNum = toNum(useSingleDate ? arrival : departure);

    const filtered = roomsdata.filter((room) => {
      const roomCap = room.basicInfo?.capacity || 0;
      if (roomCap < guests) return false;
      if (roomType && room.roomType !== roomType) return false;

      return room.availableDates?.some((range) => {
        const rStart = toNum(range.start);
        const rEnd = toNum(range.end);
        return startNum >= rStart && endNum <= rEnd;
      });
    });

    setFilteredRooms(filtered);
  }, [arrival, departure, guests, roomType, roomsdata, useSingleDate]);
  


 

  // Scroll marker effect
  useEffect(() => {
    const handleScroll = () => {
      let found = false;
      roomRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          setCurrentRoomIndex(index);
          setCurrentSection("roomType");
          found = true;
        }
      });

      const services = document.getElementById("services");
      if (services) {
        const rect = services.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
          setCurrentSection("services");
          found = true;
        }
      }

      if (!found) setCurrentSection("initial");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getRightBg = () => {
    switch (currentSection) {
      case "roomType":
        return "bg-[#e9e0d9] text-black";
      case "services":
        return " text-black";
      default:
        return "bg-[#e9e0d9] text-black";
    }
  };

  const scrollCarousel = (index: number, direction: "prev" | "next") => {
    const el = carouselRefs.current[index];
    if (!el) return;
    const scrollAmount = el.offsetWidth;
    el.scrollBy({ left: direction === "next" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  const { scrollY } = useScroll();

  // -----------------------------
  // CURTAIN ANIMATION (Left/Right)
  // -----------------------------
  const leftRaw = useTransform(scrollY, [0, 300], ["0%", "-100%"]);
  const rightRaw = useTransform(scrollY, [0, 300], ["10%", "100%"]);

  const leftCurtainX = useSpring(leftRaw, {
    stiffness: 70,
    damping: 18,
    mass: 0.25,
  });

  const rightCurtainX = useSpring(rightRaw, {
    stiffness: 70,
    damping: 18,
    mass: 0.25,
  });

  // --------------------------------------
  // IMAGE SMOOTH OPEN (FROM YOUR PROVIDED)
  // --------------------------------------
  const smoothHeight = useSpring(
  useTransform(scrollY, [0, 400], ["70vh", "80vh"]),
  { stiffness: 50, damping: 20 }
);


  const smoothScaleX = useSpring(
    useTransform(scrollY, [0, 400], [1.1, 1.4]),
    { stiffness: 50, damping: 20 }
  );

  const smoothX = useSpring(
    useTransform(scrollY, [0, 400], [0, -60]),
    { stiffness: 50, damping: 20 }
  );

  // const { scrollY } = useViewportScroll();

  // // Transformations for scroll animation
  // const scale = useTransform(scrollY, [0, 400], [1, 1.2]); // zoom in
  // const translateX = useTransform(scrollY, [0, 400], [0, -50]); // move left
  // const translateY = useTransform(scrollY, [0, 400], [0, -50]); 
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


  
  // ==================== NORMALIZE DATE ====================
 
const handleBookNow = (type: string) => {
    setRoomType(type); // auto-set type
    setShowModal(true);
  };

  // ---------------- HANDLE SEARCH IN MODAL ----------------
  const handleSearchsdata = () => {
    if (!arrival || (!useSingleDate && !departure)) {
      alert("Please select date(s)!");
      return;
    }
    const a = normalizeDate(arrival);
    const d = useSingleDate ? a : normalizeDate(departure);

    router.push(`/selectroom?arrival=${a}&departure=${d}&guests=${guests}&roomType=${roomType}`);
  };


  return (
    <div className={`w-full min-h-screen transition-colors overflow-hidden md:overflow-visible
  duration-700 ${getRightBg()}`}>
    <div className="">
  {/* Sidebar (unchanged, hidden on mobile) */}
  <div className="hidden md:flex w-1/5 max-w-3xl sticky top-0 self-start z-20">
    <div className="p-12 space-y-6 mt-40 text-sm">
      {/* <h3 className="text-lg font-bold mb-6">Index</h3>
      <p className="font-semibold">Fitness Type</p>
      <div className="space-y-4">
        {roomsdata.map((room, i) => (
          <div
            key={room.id}
            className="flex cursor-pointer items-center"
            onClick={() => {
              roomRefs.current[i]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
              setCurrentRoomIndex(i);
              setCurrentSection("roomType");
            }}
          >
            <p
              className={`px-2 py-1 rounded transition-colors duration-300 ${
                currentRoomIndex === i
                  ? "bg-gray-800/20"
                  : "hover:bg-gray-800/10"
              } text-lg opacity-60`}
            >
              - {room.title}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  </div>

  {/* Title (mobile centered, desktop unchanged) */}
  <div className="absolute top-28 md:top-32 md:left-56 -left-12  z-30 text-center md:text-left w-full md:w-auto">
    <h1
      style={{ fontFamily: '"Monrovia Modern Serif", serif' }}
      className="text-4xl md:text-7xl ms-16 font-normal text-[#1a1a1a]"
    >
      {roomheader}
    </h1>
  </div>

  {/* HERO SECTION */}
  <div className="relative mt-16 md:mt-28 w-full flex justify-center items-center h-[70vh] md:h-screen">

    {/* Hero Image */}
    <div
      className="
        absolute inset-0 
        h-[60vh] md:h-full        /* mobile responsive */
        overflow-hidden
        w-full 
        md:max-w-[1200px]
        lg:max-w-[1600px]
        xl:max-w-[1940px]
        mx-auto
      "
    >
      {heroImage && (
  <Image
    src={heroImage}
    alt="Hero"
    fill
    className="object-cover object-top"
    priority
  />
)}

    </div>

    {/* Left Curtain (unchanged) */}
    <motion.div
      style={{ x: leftCurtainX, transform: "translateZ(0)" }}
      className="absolute top-0 left-0 w-[35%] h-full bg-[#e9e0d9]"
    />

    {/* Right Curtain (unchanged) */}
    <motion.div
      style={{ x: rightCurtainX, transform: "translateZ(0)" }}
      className="absolute top-0 right-0 w-[35%] h-full bg-[#e9e0d9]"
    />

    {/* Hero Text (unchanged) */}
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white z-10 pointer-events-none"
      style={{
        y: useSpring(useTransform(scrollY, [0, 200], [50, 0]), {
          stiffness: 50,
          damping: 20,
        }),
        opacity: useSpring(useTransform(scrollY, [0, 150], [0, 1]), {
          stiffness: 50,
          damping: 20,
        }),
      }}
    >
      <h1 className="text-3xl md:text-6xl font-bold text-center">
       {herotext}
      </h1>
      <p className="text-base md:text-2xl max-w-2xl text-center mt-4">
       {herodescription}
      </p>
    </motion.div>
    

    
  </div>

  
</div>




      <div className="flex relative w-full min-h-screen ">
        
        {/* Sidebar */}
   <div className="hidden md:flex w-1/5 max-w-3xl sticky top-0 self-start z-20">
    <div className="p-12 space-y-6 mt-40 text-sm  ">
      {/* <h3 className="text-lg font-bold mb-6">Index</h3> */}
      <p className="font-semibold">Fitness Type</p>
      <div className="space-y-4">
        {roomsdata.map((room, i) => (
          <div
            key={room.id}
            className="flex cursor-pointer items-center"
            onClick={() => {
              roomRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
              setCurrentRoomIndex(i);
              setCurrentSection("roomType");
            }}
          >
            <p
              className={`px-2 py-1 rounded transition-colors duration-300 ${
                currentRoomIndex === i ? "bg-gray-800/20" : "hover:bg-gray-800/10"
              } text-lg opacity-60`}
            >
              - {room.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5 md:-ml-[4%] relative px-2">
          {/* Hero Image */}
        
     




 

    {/* Rooms Section */}
    <div className="w-full px-4 transition-colors duration-700">
      
      {roomsdata.map((room, roomIndex) => (
        <div key={room.id} className="my-8" ref={(el) => { if (el) roomRefs.current[roomIndex] = el; }}>
          {/* Room content */}
        </div>
      ))}
    </div>

 
    

          {/* Rooms Section */}
        <div className="w-full px-4 transition-colors duration-700">
    {/* Reservations Button */}
{/* Reservations Button */}
{showReservation && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
    <button
      onClick={() => setShowModal(true)} 
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
)}


       <div className="mt-20">
         <h2 className="font-serif ms-5 text-6xl">{roomshorttile}</h2>
        <p className="text-md ms-8 mt-9">{roomshortdescription}</p>
       </div>
  {roomsdata.map((room, roomIndex) => (
    <div
      key={room.id}
      className="my-8 bg-[#FDFFF5]/30 shadow-lg"
      ref={(el: HTMLDivElement | null) => {
        if (el) roomRefs.current[roomIndex] = el;
      }}
    >
      <div className="border-t mt-10 border-[#0f3333] border-8"></div>
     <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 px-8 py-5">
  {/* Left: Title + Description */}
  <div className="flex-1">
    <h1 className="text-3xl md:text-4xl font-serif mb-4">{room.title}</h1>
    {/* <h1 className="text-3xl md:text-4xl font-serif mb-4">{room.roomType}</h1> */}
    <p className="max-w-2xl">{room.description}</p>
  </div>

  {/* Right: Book Now Button */}
  <div className="flex-shrink-0">
    {/* <button
       onClick={() => handleBookNow(room.roomType)}
      className="px-8 py-3 bg-[#c78436] rounded-full text-black shadow-lg flex items-center gap-2 hover:bg-[#b37730] transition"
    >
      Book Now
    </button> */}
  </div>
</div>

      {/* Carousel */}
      <div className="relative overflow-hidden w-full mb-6 px-8 py-5">
        <button
          onClick={() => scrollCarousel(roomIndex, "prev")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3"
        >
          <HiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => scrollCarousel(roomIndex, "next")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3"
        >
          <HiChevronRight className="text-2xl" />
        </button>

        <motion.div
           className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
  ref={(el: HTMLDivElement | null) => {
    if (el) carouselRefs.current[roomIndex] = el;
  }}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.3 }}
  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2 } } }}
        >
          {room.carouselImages.map((src, i) => (
            <motion.div
              key={i}
              className="relative min-w-[300px] md:min-w-[670px] h-72 md:h-[600px] flex-shrink-0 overflow-hidden rounded-xl"
              variants={halfReveal} // your animation variant
            >
              <Image src={src} alt={`${room.title} image ${i + 1}`} fill className="object-cover" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Accordion */}
   


      
    </div>
    
  ))}
</div>



        </div>
      </div>

      {/* RESERVATION MODAL */}
   {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
    <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
      
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-xl font-bold"
        onClick={() => setShowModal(false)}
      >
        &times;
      </button>

      <h2 className="text-lg font-semibold mb-4">Book a Room</h2>

      {/* Date Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          className={`flex-1 py-2 rounded ${
            useSingleDate ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setUseSingleDate(true)}
        >
          Single Date
        </button>

        <button
          className={`flex-1 py-2 rounded ${
            !useSingleDate ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setUseSingleDate(false)}
        >
          Double Date
        </button>
      </div>

      {/* Arrival Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Arrival Date</label>
        <input
          type="date"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* Departure Date */}
      {!useSingleDate && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Departure Date</label>
          <input
            type="date"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      )}

      {/* Nights, Rooms, Guests */}
      <div className="mb-4 flex gap-2">

        {/* <div className="flex-1">
          <label className="block text-sm font-medium">Nights</label>
          <input
            type="number"
            min={1}
            value={nights}
            onChange={(e) => setNights(Number(e.target.value) || 1)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div> */}

        {/* <div className="flex-1">
          <label className="block text-sm font-medium">Rooms</label>
          <input
            type="number"
            min={1}
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value) || 1)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div> */}

        <div className="flex-1">
          <label className="block text-sm font-medium">Guests</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
       onClick={handleSearchsdata}
        className="w-full bg-black text-white py-3 rounded-full font-semibold"
      >
        Search Vacancy
      </button>

    </div>
  </div>
)}
    </div>

    
  );
}
