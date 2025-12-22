"use client";

import { useState, ChangeEvent, useRef } from "react";
import axios from "axios";

// IMGBB UPLOAD FUNCTION
const uploadToImgbb = async (file: File) => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
    fd
  );

  return res.data.data.url;
};

// ==================== TYPES ====================
interface SingleRoomType {
  id: string;
  title: string;
  roomType: string;
  bgColor: string;
  description: string;
  carouselImages: File[] | null;
  facilities: string;
  floorPlanImage: File | null;
  roomAmenities: string;
  morning: string;
  evening: string;
  night: string;
}

interface RoomObject {
  id: string;
  title: string;
  roomType: string;
  bgColor: string;
  description: string;
  carouselImages: string[];
  facilities: string[];
  floorPlanImage: string;
  roomAmenities: string;
  morning: string;
  evening: string;
  night: string;
}

interface FormDataType {
  heroImage: string;
  herotext: string;
  roomheader: string;
  roomshorttile: string;
  herodescription: string;
  roomshortdescription: string;
  roomsdata: RoomObject[];
}

// ==================== COMPONENT ====================
export default function RoomUpload() {
  const [formData, setFormData] = useState<FormDataType>({
     heroImage: "",
    herotext: "",
    roomheader: "",
    roomshorttile: "",
    herodescription: "",
    roomshortdescription: "",
    roomsdata: [],
  });

  const [singleRoom, setSingleRoom] = useState<SingleRoomType>({
    id: "",
    title: "",
    roomType: "",
    bgColor: "#000000",
    description: "",
    carouselImages: null,
    facilities: "",
    floorPlanImage: null,
    roomAmenities: "",
    morning: "",
    evening: "",
    night: "",
  });

  // File input refs
  const heroInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  // Previews
  const [carouselPreview, setCarouselPreview] = useState<string[]>([]);
  const [floorPlanPreview, setFloorPlanPreview] = useState<string>("");

  // Handle text inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSingleRoom({ ...singleRoom, [e.target.name]: e.target.value });
  };
  const handleHeroText = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, herotext: e.target.value });
  };
  const handleroomheader = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, roomheader: e.target.value });
  };
  const handleroomshorttile = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, roomshorttile: e.target.value });
  };

  const handleHeroDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, herodescription: e.target.value });
  };
  const handleroomshortdescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, roomshortdescription: e.target.value });
  };

  // Hero Image upload
  const handleHeroUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = await uploadToImgbb(file);
    setFormData({ ...formData, heroImage: url });
  };

  // Carousel upload with preview
  const handleCarouselUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSingleRoom({ ...singleRoom, carouselImages: files });
    setCarouselPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const removeCarouselImage = (index: number) => {
    if (!singleRoom.carouselImages) return;
    const newFiles = singleRoom.carouselImages.filter((_, i) => i !== index);
    setSingleRoom({ ...singleRoom, carouselImages: newFiles });
    setCarouselPreview(newFiles.map((f) => URL.createObjectURL(f)));
  };

  // Floor Plan upload with preview
  const handleFloorPlanUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSingleRoom({ ...singleRoom, floorPlanImage: e.target.files[0] });
    setFloorPlanPreview(URL.createObjectURL(e.target.files[0]));
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async () => {
    // if (!formData.heroImage) return alert("Please upload Hero Image first!");
    // if (!singleRoom.title || !singleRoom.roomType) return alert("Room Title and Type required!");

    try {
      // Upload carousel images
      const uploadedCarousel: string[] = [];
      if (singleRoom.carouselImages) {
        for (const img of singleRoom.carouselImages) {
          const url = await uploadToImgbb(img);
          uploadedCarousel.push(url);
        }
      }

      // Upload floor plan image
      let floorPlanUrl = "";
      if (singleRoom.floorPlanImage) {
        floorPlanUrl = await uploadToImgbb(singleRoom.floorPlanImage);
      }

      // Create room object
      const roomObj: RoomObject = {
        id: singleRoom.id || new Date().getTime().toString(),
        title: singleRoom.title,
        roomType: singleRoom.roomType,
        bgColor: singleRoom.bgColor,
        description: singleRoom.description,
        carouselImages: uploadedCarousel,
        facilities: singleRoom.facilities.split(",").map((s) => s.trim()),
        floorPlanImage: floorPlanUrl,
        roomAmenities: singleRoom.roomAmenities,
        morning: singleRoom.morning,
        evening: singleRoom.evening,
        night: singleRoom.night,
      };

      // Final payload
     const payload = {
   heroImage: formData.heroImage,
      herotext: formData.herotext,
      roomheader: formData.roomheader,
      roomshorttile: formData.roomshorttile,
      herodescription: formData.herodescription,
      roomshortdescription: formData.roomshortdescription,
  roomsdata: [
    {
      id: singleRoom.id || new Date().getTime().toString(),
      title: singleRoom.title,
      roomType: singleRoom.roomType, 
      description: singleRoom.description,
      carouselImages: uploadedCarousel,
      facilities: singleRoom.facilities.split(",").map(s => s.trim()),
      menuImage: floorPlanUrl, // map floorPlanImage to menuImage
      morning: singleRoom.morning,
      evening: singleRoom.evening,
      night: singleRoom.night,
    }
  ]
};

      const res = await axios.post("https://nascent.virtualshopbd.com/api/fitness/resturntadd", payload);

      if (res.data.success) {
        alert("Data saved successfully!");

        // Reset all
        setFormData({
  heroImage: "",
  herotext: "",
  roomheader: "",
  roomshorttile: "",
  herodescription: "",
  roomshortdescription: "",
  roomsdata: [],
});
        setSingleRoom({
          id: "",
          title: "",
          roomType: "",
          bgColor: "#000000",
          description: "",
          carouselImages: null,
          facilities: "",
          floorPlanImage: null,
          roomAmenities: "",
          morning: "",
          evening: "",
          night: "",
        });
        setCarouselPreview([]);
        setFloorPlanPreview("");

        if (heroInputRef.current) heroInputRef.current.value = "";
        if (carouselInputRef.current) carouselInputRef.current.value = "";
        if (floorPlanInputRef.current) floorPlanInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("Error saving data. Check console.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black rounded-xl shadow-xl border border-gray-300">
      {/* HERO IMAGE */}
      {/* <label className="block text-lg font-semibold mb-2">Hero Image</label>
      <input type="file" ref={heroInputRef} className="input-white" onChange={handleHeroUpload} />
      {formData.heroImage && (
        <div className="relative mt-2 w-48 h-48">
          <img src={formData.heroImage} className="w-full h-full object-cover rounded" />
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, heroImage: "" });
              if (heroInputRef.current) heroInputRef.current.value = "";
            }}
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
          >
            x
          </button>
        </div>
      )} */}

       {/* <label className="block mt-4">Hero Text</label>
      <input
        className="input-white"
        value={formData.herotext}
        onChange={handleHeroText}
        placeholder="Hero Title..."
      />
      <label className="block mt-4">Hero Description</label>
      <textarea
        className="input-white h-24"
        value={formData.herodescription}
        onChange={handleHeroDescription}
        placeholder="Short description..."
      />
 <label className="block mt-4">Room Header Title</label>
      <input
        className="input-white"
        value={formData.roomheader}
        onChange={handleroomheader}
        placeholder="Hero Title..."
      />
 <label className="block mt-4">Fitness Short Title</label>
      <input
        className="input-white"
        value={formData.roomshorttile}
        onChange={handleroomshorttile}
        placeholder="Hero Title..."
      />

    
      
      <label className="block mt-4">Fitness Short Description</label>
      <textarea
        className="input-white h-24"
        value={formData.roomshortdescription}
        onChange={handleroomshortdescription}
        placeholder="Short description..."
      /> */}

      <h2 className="text-3xl font-bold mt-10 mb-4">Fitness Information</h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "title", label: "Fitness Title" },
          { name: "roomType", label: "Fitness Type" },
          { name: "bgColor", label: "BG Color", type: "color" },
        ].map((f) => (
          <label key={f.name} className="block">
            {f.label}
            <input
              name={f.name}
              type={f.type || "text"}
              className="input-white h-12"
              value={singleRoom[f.name as keyof SingleRoomType] as string}
              onChange={handleChange}
            />
          </label>
        ))}
      </div>

      <label className="block mt-4">
        Description
        <textarea name="description" className="input-white h-24" value={singleRoom.description} onChange={handleChange} />
      </label>

      <label className="block mt-4">
        Carousel Images
        <input type="file" multiple ref={carouselInputRef} className="input-white" onChange={handleCarouselUpload} />
      </label>

      <div className="flex flex-wrap mt-2 gap-2">
        {carouselPreview.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} className="w-24 h-24 object-cover rounded" />
            <button
              type="button"
              onClick={() => removeCarouselImage(i)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <label className="block mt-4">
        Facilities
        <input name="facilities" className="input-white" value={singleRoom.facilities} onChange={handleChange} />
      </label>

      {/* Meal Sections */}
      <label className="block mt-4">
        morning
        <textarea name="morning" className="input-white h-20" value={singleRoom.morning} onChange={handleChange} />
      </label>

      <label className="block mt-4">
        evening
        <textarea name="evening" className="input-white h-20" value={singleRoom.evening} onChange={handleChange} />
      </label>

      <label className="block mt-4">
        night
        <textarea name="night" className="input-white h-20" value={singleRoom.night} onChange={handleChange} />
      </label>

      <button className="btn mt-8 ml-3 bg-red-600 text-black" onClick={handleSubmit}>
        Submit All Data
      </button>

      <style jsx>{`
        .input-white {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          background: white;
          color: black;
          border-radius: 8px;
          margin-top: 4px;
        }
        .btn {
          padding: 10px 18px;
          border-radius: 8px;
          background: #f5f5f5;
          border: 1px solid #ccc;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
