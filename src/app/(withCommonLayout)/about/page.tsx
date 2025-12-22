"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* ✅ Hero Section */}
      <section className="bg-green-100  py-16 px-6 md:px-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mt-12">
          About <span className="text-green-700">Our Doctor Portal</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          We connect patients with experienced doctors across the country,
          providing convenient, reliable, and trusted healthcare solutions.
        </p>
      </section>

      {/* ✅ Mission & Vision */}
      <section className="container mx-auto px-6 md:px-12 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
         <Image
  src="https://media.istockphoto.com/id/507954725/photo/never-fear-the-doctor-is-here.jpg?s=612x612&w=0&k=20&c=fPGU8TcaU-88cAwZvALWghx6fJ4j3zj4C79TKI-WRP4="
  alt="Doctor"
  width={600}
  height={400}
  className="rounded-2xl shadow-lg object-cover"
  priority
/>

        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          <p className="text-gray-600">
            To make quality healthcare accessible and affordable for everyone by
            bridging the gap between patients and certified medical professionals.
          </p>
          <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
          <p className="text-gray-600">
            We envision a world where no one has to wait for healthcare.
            Technology should enable faster, smarter, and more efficient
            treatment options for everyone.
          </p>
        </div>
      </section>

      {/* ✅ Why Choose Us */}
      <section className="bg-green-50 py-12 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Why Choose Us
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 text-center">
          {[
            {
              title: "Verified Doctors",
              desc: "All doctors are licensed and verified by medical boards.",
            },
            {
              title: "24/7 Support",
              desc: "Round-the-clock access to healthcare guidance.",
            },
            {
              title: "Easy Appointments",
              desc: "Book appointments with just a few clicks.",
            },
            {
              title: "Affordable Fees",
              desc: "We ensure fair and transparent pricing for all treatments.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-green-700">
                {item.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Our Team */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Meet Our Doctors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {[
            {
              name: "Dr. Shamim Islam",
              specialty: "Oral Surgeon",
              img: "https://img.freepik.com/free-photo/smiling-male-doctor-white-coat-with-stethoscope_23-2148827744.jpg?w=740",
            },
            {
              name: "Dr. Tanvir Ahmed",
              specialty: "Pediatric Specialist",
              img: "https://img.freepik.com/free-photo/portrait-doctor-wearing-white-coat_23-2148723901.jpg?w=740",
            },
            {
              name: "Dr. Hasan Khan",
              specialty: "Dentist",
              img: "https://img.freepik.com/free-photo/confident-young-male-doctor_1098-18155.jpg?w=740",
            },
            {
              name: "Dr. Maruf Hasan",
              specialty: "Cosmetic Dentist",
              img: "https://img.freepik.com/free-photo/successful-medical-doctor_1098-19743.jpg?w=740",
            },
          ].map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              {/* ✅ Full-width, fixed-height image */}
              <div className="relative w-full h-52">
               <Image
  src={doctor.img}
  alt={doctor.name}
  className="object-cover rounded-lg"
  width={300}   // desired width
  height={300}  // desired height
/>
              </div>
              {/* ✅ Text Section */}
              <div className="p-5 flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-green-700 text-sm">{doctor.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
