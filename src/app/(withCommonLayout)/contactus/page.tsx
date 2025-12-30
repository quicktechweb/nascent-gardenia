"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaRegCalendarAlt, FaWeixin, FaYoutube } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface ModalFormState {
  name: string;
  email: string;
  phone: string;
  country: string;
  passportNumber: string;
  nidNumber: string;
   nidFront?: File[];   // <-- Array of files
  nidBack?: File[];
  passport?: File[];
}

interface ContactData {
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    weixin: string;
    youtube: string;
  };
}

export default function ContactUsSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState<ModalFormState>({
    name: "", email: "", phone: "", country: "", passportNumber: "", nidNumber: ""
  });
  const [data, setData] = useState<ContactData | null>(null);
   const [showReservation, setShowReservation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [arrival, setArrival] = useState("");
    const [departure, setDeparture] = useState("");
    const [useSingleDate, setUseSingleDate] = useState(true);
    const [nights, setNights] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(1);
   const router = useRouter();

  useEffect(() => {
    axios.get<ContactData>("https://nascent.virtualshopbd.com/api/contact-data")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setModalForm({ ...modalForm, [e.target.name]: e.target.files[0] });
  };

 const handleModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const payload = {
      name: modalForm.name,
      email: modalForm.email,
      phone: modalForm.phone,
      country: modalForm.country,
      nidNumber: modalForm.nidNumber,
      passportNumber: modalForm.passportNumber,
    };

    await axios.post(
      "https://nascent.virtualshopbd.com/api/futurecontact/add",
      payload
    );

    alert("Form submitted successfully!");

    setModalForm({
      name: "",
      email: "",
      phone: "",
      country: "",
      nidNumber: "",
      passportNumber: "",
    });

    setModalOpen(false);
  } catch (err) {
    console.error(err);
    alert("Failed to submit form");
  }
};


   useEffect(() => {
      const handleScroll = () => {
        const bannerHeight = 20; // height of your hero/banner in px (adjust if needed)
        if (window.scrollY > bannerHeight) {
          setShowReservation(true);
        } else {
          setShowReservation(false);
        }
      };
    
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
  
     const [isScrolling, setIsScrolling] = useState(false);
  
     const normalizeDate = (date: string) => {
      if (!date) return "";
      if (date.includes("/")) {
        const [dd, mm, yyyy] = date.split("/");
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      }
      return date;
    };
  
    const toNum = (date: string) => new Date(date).getTime();

     const handleSearchsdata = () => {
    if (!arrival || (!useSingleDate && !departure)) {
      alert("Please select date(s)!");
      return;
    }
    const a = normalizeDate(arrival);
    const d = useSingleDate ? a : normalizeDate(departure);

    router.push(`/selectroom?arrival=${a}&departure=${d}&guests=${guests}`);
  };
  

  return (
    <section className="bg-[#e9e0d9] py-24 px-5 min-h-screen relative mt-5">
      {/* MAP */}
      <div className="w-full max-w-7xl mx-auto mb-16 rounded-xl overflow-hidden shadow-xl border border-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.0171535417!2d116.400324!3d39.914935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35f054e5105eb2d7%3A0xe77b0615bb51d0da!2sThe%20Peninsula%20Beijing!5e0!3m2!1sen!2s!4v1700000000000"
          className="w-full h-[350px] sm:h-[450px] border-0"
          loading="lazy"
          allowFullScreen
        />
      </div>

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
      {/* Contact + Modal */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 mt-24">
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">Get in Touch</h2>
          <p className="text-gray-700 text-lg">Have questions, suggestions, or just want to say hello? Reach out via phone, email, or visit us.</p>

          <div className="space-y-5 mt-6">
            {[{ icon: <HiOutlinePhone className="text-yellow-500 w-7 h-7" />, text: data?.phone },
              { icon: <HiOutlineMail className="text-yellow-500 w-7 h-7" />, text: data?.email },
              { icon: <HiOutlineLocationMarker className="text-yellow-500 w-7 h-7" />, text: data?.address }].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">
                {item.icon}
                <span className="text-gray-900 font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-5 mt-8">
            <a href={data?.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition"><FaFacebookF size={24} /></a>
            <a href={data?.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:scale-110 transition"><FaInstagram size={24} /></a>
            <a href={data?.socialLinks.weixin} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:scale-110 transition"><FaWeixin size={24} /></a>
            <a href={data?.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:scale-110 transition"><FaYoutube size={24} /></a>
          </div>

          <button onClick={() => setModalOpen(true)} className=" bottom-10 left-1/2 bg-gradient-to-b from-[#0f3333] via-[#0c0c0c] to-[#0f3333] text-white font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl z-50">
            Future Connect
          </button>
        </div>

        {/* Disabled Contact Form */}
        <form className="bg-white p-10 rounded-3xl shadow-2xl space-y-10">
          <input type="text" placeholder="Your Name" className="w-full p-4 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500" disabled />
          <input type="email" placeholder="Your Email" className="w-full p-4 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500" disabled />
          <textarea placeholder="Your Message" className="w-full p-4 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none h-36 resize-none text-gray-900 placeholder-gray-500" disabled />
          <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-4 rounded-xl cursor-not-allowed" disabled>Send Message</button>
        </form>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f3333] bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full relative border border-white/30">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 font-bold text-xl">&times;</button>
            <div className="flex justify-center gap-4 mb-6">
              <FaFacebookF className="text-blue-600 w-6 h-6 hover:scale-110 transition" />
              <FaInstagram className="text-pink-500 w-6 h-6 hover:scale-110 transition" />
              <FaWeixin className="text-green-600 w-6 h-6 hover:scale-110 transition" />
              <FaYoutube className="text-red-600 w-6 h-6 hover:scale-110 transition" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Feedback Form</h2>
          <form onSubmit={handleModalSubmit} className="space-y-4">
  {/* Basic Info */}
  <input
    type="text"
    name="name"
    value={modalForm.name}
    onChange={handleModalChange}
    placeholder="Name"
    className="w-full p-3 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500 bg-white/60 backdrop-blur-sm"
    required
  />
  <input
    type="email"
    name="email"
    value={modalForm.email}
    onChange={handleModalChange}
    placeholder="Email"
    className="w-full p-3 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500 bg-white/60 backdrop-blur-sm"
    required
  />
  <input
    type="text"
    name="phone"
    value={modalForm.phone}
    onChange={handleModalChange}
    placeholder="Phone"
    className="w-full p-3 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500 bg-white/60 backdrop-blur-sm"
    required
  />
  <input
    type="text"
    name="country"
    value={modalForm.country}
    onChange={handleModalChange}
    placeholder="Country"
    className="w-full p-3 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500 bg-white/60 backdrop-blur-sm"
    required
  />
  {/* <input
    type="password"
    name="password"
    value={modalForm.password}
    onChange={handleModalChange}
    placeholder="Password"
    className="w-full p-3 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500 bg-white/60 backdrop-blur-sm"
    required
  /> */}
  {/* <input
    type="text"
    name="nidNumber"
    value={modalForm.nidNumber}
    onChange={handleModalChange}
    placeholder="NID Number"
    className="w-full p-3 rounded-xl border border-gray-300 focus:border-yellow-500 outline-none text-gray-900 placeholder-gray-500 bg-white/60 backdrop-blur-sm"
    required
  /> */}

  {/* NID Images */}
  {/* NID Images */}
 {/* NID Number */}
  <input
    type="text"
    name="nidNumber"
    value={modalForm.nidNumber}
    onChange={handleModalChange}
    placeholder="NID Number"
    className="w-full p-3 rounded-xl border"
    required
  />

  {/* Passport Number */}
  <input
    type="text"
    name="passportNumber"
    value={modalForm.passportNumber}
    onChange={handleModalChange}
    placeholder="Passport Number"
    className="w-full p-3 rounded-xl border"
    required
  />


  <button
    type="submit"
    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold py-3 rounded-xl hover:scale-105 transition-transform duration-300"
  >
    Submit Feedback
  </button>
</form>

          </div>
        </div>
      )}

        {/* RESERVATION MODAL */}
   {showModal && (
  <div className="fixed inset-0 bg-black/50 text-black flex items-center justify-center z-20">
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
    </section>
  );
}
