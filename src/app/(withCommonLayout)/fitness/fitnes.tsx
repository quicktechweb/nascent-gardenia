"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants, useScroll } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import axios from "axios";
import { useViewportScroll, useTransform,useSpring  } from "framer-motion";

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
  bgColor: string;
  description: string;
  carouselImages: string[];
  facilities: string[];
  floorPlanImage: string;
  basicInfo: BasicInfo;
}

interface ApiRoomData {
  _id: string;
  heroImage: string;
  roomsdata: Room[];
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: ApiRoomData[];
}

export default function RoomLayout() {

  const staticData = [
    {
      heroImage: "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
      roomsdata: [
        {
          id: "1764739591531",
          title: "Alps Wing  Premier Fitness",
          roomType: "r",
          bgColor: "#000000",
          description: "Elegant premier guestrooms with extra space and luxury amenities for a refined stayElegant premier guestrooms with extra space and luxury amenities for a refined stayElegant premier guestrooms with extra space and luxury amenities for a refined stay",
          carouselImages: [
            "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
            "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
            "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
          ],
          facilities: ["e"],
          floorPlanImage: "https://i.ibb.co/cK09FrvL/gym2.jpg",
          roomAmenities: "e",
          basicInfo: {
            bedType: "ty",
            size: "yt",
            capacity: 6,
            numberOfRooms: 6,
            bedSize: "t",
            floorInformation: "r",
            view: "r",
            checkinOut: "rt",
            extraBed: "r",
            connectingRoom: "tr",
          },
        },
      ],
    },
    {
      heroImage:
        "https://i.ibb.co/VYGDp65y/1763868724866-Whats-App-Image-2025-11-20-at-3-57-04-PM-new.jpg",
      roomsdata: [
        {
          id: "1764739839100",
          title: "Alps Wing Classic Fitness",
          roomType: "dsdf55557777",
          bgColor: "#000000",
          description: "Elegant premier guestrooms with extra space and luxury amenities for a refined stayElegant premier guestrooms with extra space and luxury amenities for a refined stayElegant premier guestrooms with extra space and luxury amenities for a refined stay",
          carouselImages: [
           "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
            "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
            "https://i.ibb.co.com/cK09FrvL/gym2.jpg",
          ],
          facilities: ["ee"],
          floorPlanImage:
            "https://i.ibb.co/VYGDp65y/1763868724866-Whats-App-Image-2025-11-20-at-3-57-04-PM-new.jpg",
          roomAmenities: "e",
          basicInfo: {
            bedType: "44444444444",
            size: "e",
            capacity: 4,
            numberOfRooms: 4,
            bedSize: "4",
            floorInformation: "4",
            view: "4",
            checkinOut: "4",
            extraBed: "4",
            connectingRoom: "4",
          },
        },
      ],
    },
  ];
const allRooms: Room[] = staticData.flatMap((item) => item.roomsdata);

 const [roomsdata] = useState<Room[]>(allRooms);
  const [heroImage] = useState(staticData[0].heroImage);

  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<
    "initial" | "roomType" | "services"
  >("initial");

  const roomRefs = useRef<HTMLDivElement[]>([]);
  const carouselRefs = useRef<HTMLDivElement[]>([]);

  
  const [windowWidth, setWindowWidth] = useState(0);

useEffect(() => {
  setWindowWidth(window.innerWidth); // only runs on client
}, []);
  // Fetch rooms from API
 

  const halfReveal: Variants = {
    hidden: { opacity: 0, y: 80, scale: 0.95, clipPath: "inset(40% 0% 0% 0%)", filter: "blur(6px)" },
    show: { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] } }
  };

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
    const rightRaw = useTransform(scrollY, [0, 300], ["0%", "100%"]);
  
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
      useTransform(scrollY, [0, 400], ["70vh", "90vh"]),
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

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${getRightBg()}`}>
      <div className="flex  relative w-full min-h-screen">
        {/* Sidebar */}
      <div className="hidden md:flex w-1/5 max-w-3xl sticky top-0 self-start z-20">
    <div className="p-12 space-y-6 mt-40 text-sm  ">
      <h3 className="text-lg font-bold mb-6">Index</h3>
      <p className="font-semibold">Room Type</p>
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
      <h1 style={{ fontFamily: '"Monrovia Modern Serif", serif' }} className="mt-40 text-8xl   font-normal">
                     Fitness & Premier
                   </h1>
                   
              <div className="relative w-full flex flex-col items-center justify-start">
     
       {/* Hero Section */}
      <div className="relative w-full flex justify-center items-center h-screen">
       <motion.div
         className="relative w-full max-w-[1500px] overflow-hidden"
         style={{
           height: smoothHeight,
           scaleX: smoothScaleX,
           scaleY: 1,
           x: smoothX,
         }}
       >
         {/* IMAGE WITH EDGE MASK – NO BORDER / NO LINE */}
         <motion.div
           className="absolute inset-0"
           style={{
             WebkitMaskImage:
               "linear-gradient(to right, transparent 0%, black 2%, black 100%, transparent 100%)",
             maskImage:
               "linear-gradient(to right, transparent 0%, black 2%, black 100%, transparent 100%)",
           }}
         >
           <Image
             src="https://i.ibb.co.com/cK09FrvL/gym2.jpg"
             alt="Hero"
             fill
             className="object-cover"
             style={{ objectPosition: "center" }}
             priority
           />
         </motion.div>
     
         {/* Left curtain */}
         <motion.div
           style={{
             x: leftCurtainX,
             transform: "translateZ(0)",
           }}
           className="absolute top-0 left-0 w-[35%] h-full bg-[#e9e0d9]"
         />
     
         {/* Right curtain */}
         <motion.div
           style={{
             x: rightCurtainX,
             transform: "translateZ(0)",
           }}
           className="absolute top-0 right-0 w-[35%] h-full bg-[#e9e0d9]"
         />
       </motion.div>
     
       {/* HERO TEXT */}
       <motion.div
       className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center
                  text-white z-10 pointer-events-none"
       style={{
         y: useSpring(
           useTransform(scrollY, [0, 200], [50, 0]), // scroll করলে text উপরে উঠবে
           { stiffness: 50, damping: 20 }
         ),
         opacity: useSpring(
           useTransform(scrollY, [0, 150], [0, 1]), // scroll করলে fade in হবে
           { stiffness: 50, damping: 20 }
         ),
       }}
     >
       <h1 className="text-5xl md:text-5xl font-bold text-center">
         NASCENT GARDENIA BARIDHARA
       </h1>
       <p className="text-lg md:text-2xl max-w-2xl text-center mt-4">
         Discover our premium rooms and services
       </p>
     </motion.div>
     
     </div>
     
     
       {/* Reservation Button */}
       <motion.div
         className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
         style={{
           opacity: useSpring(useTransform(scrollY, [300, 400], [0, 1]), {
             stiffness: 50,
             damping: 20,
           }),
           y: useSpring(useTransform(scrollY, [300, 400], [20, 0]), {
             stiffness: 50,
             damping: 20,
           }),
         }}
       >
        
       </motion.div>
     
       
     </div>
     


          {/* Rooms Section */}
         <div className="w-full px-4 transition-colors duration-700">
       
              <div className="mt-20">
                <h2 className="font-serif text-6xl">Guestrooms</h2>
               <p className="text-md ms-12 mt-9">The Alps Wing, Atago Wing, and Usui Wing––our three guestroom wings––stand within the grounds of the hotel amid the refreshing breeze and surrounded by the lush woodlands of Karuizawa. We invite you to enjoy a moment of luxurious relaxation, pondering long-held traditions and the passage of time.</p>
              </div>
         {roomsdata.map((room, roomIndex) => (
           <div
             key={room.id}
             className="my-8 bg-[#e4d9d1] shadow-lg"
             ref={(el: HTMLDivElement | null) => {
               if (el) roomRefs.current[roomIndex] = el;
             }}
           >
          
             <div className="border-t mt-10 border-[#0f3333] border-8"></div>

              <div className="flex flex-col md:flex-row justify-between gap-2  ms-5">

  {/* LEFT — Title + Description */}
  <div className="">
    <h1 className="text-3xl md:text-4xl font-serif mb-4 mt-7">{room.title}</h1>
    <p className="max-w-2xl mb-4">{room.description}</p>
  </div>

  {/* RIGHT — Opening Hours */}
  <div className="md:w-1/3 p-4 ">
    <h3 className="text-xl font-semibold mb-2 mt-4">Opening Hours</h3>

 <div className="space-y-2 text-gray-700 text-base">

  <p>
    <strong>Morning Session:</strong>
    <span className="ml-2">6:00 a.m. – 9:00 a.m.</span>
    <span className="opacity-60 ml-1">(LO 8:45 a.m.)</span>
  </p>

  <p>
    <strong>Afternoon Session:</strong>
    <span className="ml-2">12:00 p.m. – 3:00 p.m.</span>
    <span className="opacity-60 ml-1">(LO 2:45 p.m.)</span>
  </p>

  <p>
    <strong>Evening Session:</strong>
    <span className="ml-2">5:00 p.m. – 8:00 p.m.</span>
    <span className="opacity-60 ml-1">(LO 7:45 p.m.)</span>
  </p>

</div>


  </div>

</div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 -mt-16 gap-4 px-8 py-5">
         {/* Left: Title + Description */}
       
       
         {/* Right: Book Now Button */}
       
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
                 className="flex gap-4 overflow-x-auto scrollbar-hide"
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
    </div>
  );
}
