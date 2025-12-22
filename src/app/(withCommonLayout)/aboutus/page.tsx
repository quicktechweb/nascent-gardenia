"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
};

type AboutUsData = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  propertyTitle: string;
  propertyDesc1: string;
  propertyDesc2: string;
  propertyImage: string;
  mission: string;
  vision: string;
  teamMembers: TeamMember[];
};

export default function AboutUs() {
  const [data, setData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    axios
      .get<AboutUsData>("https://nascent.virtualshopbd.com/api/about-us")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!data) return <p className="text-center py-20">Loading...</p>;

  return (
    <section className="w-full font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[500px]">
        <Image
          src={data.heroImage || "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg"}
          alt="About Us Hero"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 bg-black/25">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg tracking-tight">
            {data.heroTitle}
          </h1>
          <p className="text-lg md:text-2xl drop-shadow-md max-w-2xl">
            {data.heroSubtitle}
          </p>
        </div>
      </div>

      {/* About the Property Section */}
      <div className="max-w-7xl mx-auto py-24 px-5 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative w-full h-92 md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={data.propertyImage || "https://baridhara.nascenthotels.com/wp-content/uploads/2022/06/res.jpg"}
            alt="Our Property"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 border-l-4 border-yellow-400 pl-4">
            {data.propertyTitle}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{data.propertyDesc1}</p>
          <p className="text-gray-700 text-lg leading-relaxed">{data.propertyDesc2}</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl  mx-auto py-24 px-5 grid md:grid-cols-2 gap-16 items-center -mt-20">
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 border-l-4 border-yellow-400 pl-4">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{data.mission}</p>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-900 border-l-4 border-yellow-400 pl-4">
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{data.vision}</p>
        </div>
      </div>

      {/* Team Section */}
     <div className="bg-gray-50 py-12 mt-5">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-16 tracking-tight">
          Meet Our Team
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          spaceBetween={30}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
          }}
        >
          {data.teamMembers.map((member: TeamMember, index: number) => (
            <SwiperSlide key={index}>
              <div className="bg-white mb-5 rounded-3xl  p-6 flex flex-col items-center text-center
                              transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl">
                <div className="w-32 h-32 relative  rounded-full overflow-hidden ring-4 ring-yellow-400 ring-offset-2">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-500 mb-4">
                  {member.role}
                </p>

                <a
                  href={member.linkedin}
                  target="_blank"
                  className="text-yellow-500 hover:text-yellow-600 font-medium transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r  py-20 px-5 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Join Us on Our Journey
        </h2>
        <p className="text-gray-900 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
          We are always looking for passionate individuals to grow with us. Become a part of our team and help shape the future of luxury hospitality.
        </p>
        <button className="bg-gray-900 text-white font-bold py-4 px-10 rounded-xl hover:scale-105 hover:bg-gray-800 transition-all duration-300">
          Contact Us
        </button>
      </div>
    </section>
  );
}
