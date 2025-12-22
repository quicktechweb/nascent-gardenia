"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

export default function HeroCurtainReveal() {
  const { scrollY } = useScroll();

  // Raw transform values
  const leftRaw = useTransform(scrollY, [0, 300], ["0%", "-100%"]);
  const rightRaw = useTransform(scrollY, [0, 300], ["0%", "100%"]);

  // Smooth spring animation
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

  return (
    <div className="w-full min-h-[200vh] flex flex-col items-center">

      <div className="relative w-full h-[140vh] flex items-center justify-center">

        {/* FULL-WIDTH IMAGE CONTAINER */}
        <div className="relative w-full h-[70vh] overflow-hidden">
          <Image
            src="https://www.mampei.co.jp/wp-content/themes/mampei/assets/img/rooms/fv.webp"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />

          {/* LEFT curtain */}
          <motion.div
            style={{ x: leftCurtainX }}
            className="absolute top-0 left-0 w-[35%] h-full bg-[#f4efeb]"
          />

          {/* RIGHT curtain */}
          <motion.div
            style={{ x: rightCurtainX }}
            className="absolute top-0 right-0 w-[35%] h-full bg-[#f4efeb]"
          />
        </div>

      </div>

      <div className="h-[120vh]"></div>
    </div>
  );
}




 