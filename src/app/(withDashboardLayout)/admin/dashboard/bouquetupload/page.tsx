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
interface SingleAvailableDate {
  start: string;
  end: string;
}

interface BasicInfo {
  size: string;
  capacity: number;

  floorInformation: string;
  view: string;

}

interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface SingleRoomType {
  id: string;
  title: string;
  roomType: string;
  bgColor: string;
  description: string;
  carouselImages: File[] | null;
  facilities: string;
  roomAmenities: string;
    packages: PackageType[];


  size: string;
  capacity: string;

  floorInformation: string;
  view: string;

  
  availableStart: string;
  availableEnd: string;
}

interface RoomObject {
  id: string;
  title: string;
  roomType: string;
  bgColor: string;
  description: string;
  carouselImages: string[];
  facilities: string[];
  roomAmenities: string;
  packages: PackageType[];
  basicInfo: BasicInfo;
  availableDates: SingleAvailableDate[];
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
    packages: [],
    roomType: "",
    bgColor: "#000000",
    description: "",
    carouselImages: null,
    facilities: "",
    roomAmenities: "",

    size: "",
    capacity: "",
    floorInformation: "",
    view: "",

    availableStart: "",
    availableEnd: "",
  });

  const [showPackageModal, setShowPackageModal] = useState(false);

const [packageForm, setPackageForm] = useState({
  name: "",
  description: "",
  price: "",
});

  const emptyFormData: FormDataType = {
  heroImage: "",
  herotext: "",
  roomheader: "",
  roomshorttile: "",
  herodescription: "",
  roomshortdescription: "",
  roomsdata: [],
};

const emptySingleRoom: SingleRoomType = {
  id: "",
  title: "",
  packages: [],
  roomType: "",
  bgColor: "#000000",
  description: "",
  carouselImages: null,
  facilities: "",
  roomAmenities: "",

  size: "",
  capacity: "",

  floorInformation: "",
  view: "",

  availableStart: "",
  availableEnd: "",
};


  // File Refs
  const heroInputRef = useRef<HTMLInputElement>(null);
  const carouselInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  // Previews
  const [carouselPreview, setCarouselPreview] = useState<string[]>([]);
  const [floorPlanPreview, setFloorPlanPreview] = useState<string>("");

  // Room text fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSingleRoom({ ...singleRoom, [e.target.name]: e.target.value });
  };

  // Hero Inputs
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

  // Hero Upload
  const handleHeroUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = await uploadToImgbb(file);

    setFormData({
      ...formData,
      heroImage: url,
    });
  };

  // Carousel Upload
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

  // Floorplan Upload
  const handleFloorPlanUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSingleRoom({ ...singleRoom, });
    setFloorPlanPreview(URL.createObjectURL(e.target.files[0]));
  };

  // ==================== SUBMIT ====================
 const handleSubmit = async () => {
  try {
    const uploadedCarousel: string[] = [];
    if (singleRoom.carouselImages) {
      for (const img of singleRoom.carouselImages) {
        uploadedCarousel.push(await uploadToImgbb(img));
      }
    }

    

    const roomObj: RoomObject = {
      id: new Date().getTime().toString(),
      title: singleRoom.title,
      roomType: singleRoom.roomType,
      bgColor: singleRoom.bgColor,
      description: singleRoom.description,
      carouselImages: uploadedCarousel,
      facilities: singleRoom.facilities.split(",").map((s) => s.trim()),
      roomAmenities: singleRoom.roomAmenities,
      packages: singleRoom.packages,
      basicInfo: {
        size: singleRoom.size,
        capacity: Number(singleRoom.capacity),

        floorInformation: singleRoom.floorInformation,
        view: singleRoom.view,

      },
      availableDates: [
        {
          start: singleRoom.availableStart,
          end: singleRoom.availableEnd,
        },
      ],
    };

    const payload: FormDataType = {
      heroImage: formData.heroImage,
      herotext: formData.herotext,
      roomheader: formData.roomheader,
      roomshorttile: formData.roomshorttile,
      herodescription: formData.herodescription,
      roomshortdescription: formData.roomshortdescription,
      roomsdata: [roomObj],
    };

    await axios.post("https://nascent.virtualshopbd.com/api/bouquet/add", payload);

    // -------------- RESET ALL INPUTS --------------
    setFormData(emptyFormData);
    setSingleRoom(emptySingleRoom);

    if (heroInputRef.current) heroInputRef.current.value = "";
    if (carouselInputRef.current) carouselInputRef.current.value = "";
    if (floorPlanInputRef.current) floorPlanInputRef.current.value = "";

    setCarouselPreview([]);
    setFloorPlanPreview("");

    alert("Uploaded!");
  } catch (err) {
    console.error(err);
    alert("Error saving data");
  }
};



  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black rounded-xl shadow-xl border border-gray-300">
      {/* HERO IMAGE */}
      {/* <label className="block text-lg font-semibold mb-2">Hero Image</label>
<input
  type="file"
  ref={heroInputRef}
  className="input-white"
  onChange={handleHeroUpload}
/>
{formData.heroImage && (
  <div className="relative mt-2 w-48 h-48">
    <img
      src={formData.heroImage}
      className="w-full h-full object-cover rounded"
    />
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
 <label className="block mt-4">Room Short Title</label>
      <input
        className="input-white"
        value={formData.roomshorttile}
        onChange={handleroomshorttile}
        placeholder="Hero Title..."
      /> */}

    
      
      {/* <label className="block mt-4">Room Short Description</label>
      <textarea
        className="input-white h-24"
        value={formData.roomshortdescription}
        onChange={handleroomshortdescription}
        placeholder="Short description..."
      /> */}

      <h2 className="text-3xl font-bold mt-10 mb-4">Bouquet Information</h2>

      <div className="grid grid-cols-2 gap-4">
        {[
         
          { name: "title", label: "Room Title" },
          
          
         
          { name: "roomType", label: "Room Type" },
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
        <textarea
          name="description"
          className="input-white h-24"
          value={singleRoom.description}
          onChange={handleChange}
        />
      </label>

      <label className="block mt-4 text-gray-700 font-semibold">
  Carousel Images
</label>

{/* Upload area */}
<div
  onClick={() => carouselInputRef.current.click()}
  className="mt-2 w-full min-h-[120px] border-2 border-dashed border-[#c78436] rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-[#9b59b6] hover:text-[#9b59b6] transition-colors p-6"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 mb-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 15a4 4 0 014-4h10a4 4 0 110 8H7a4 4 0 01-4-4z"
    />
  </svg>
  <p className="text-sm text-center">
    Drag & drop images here, or{" "}
    <span className="text-[#c78436] font-semibold">click to upload</span>
  </p>
</div>

<input
  type="file"
  multiple
  ref={carouselInputRef}
  className="hidden"
  onChange={handleCarouselUpload}
/>

{/* Preview */}
{carouselPreview.length > 0 && (
  <div className="flex flex-wrap mt-4 gap-4">
    {carouselPreview.map((src, i) => (
      <div
        key={i}
        className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md border border-gray-200 group"
      >
        <img
          src={src}
          alt={`carousel-${i}`}
          className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => removeCarouselImage(i)}
          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:opacity-100 hover:bg-red-700 transition-shadow shadow-md"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}

      <label className="block mt-4">
        Facilities
        <input
          name="facilities"
          className="input-white"
          value={singleRoom.facilities}
          onChange={handleChange}
        />
      </label>

      <label className="block mt-4">
        Room Amenities
        <textarea
          name="roomAmenities"
          placeholder="Electric kettle / Cups / Wine glasses / Bathroom / Mini Bar / Children under 12 stay free..."
          className="input-white h-24"
          value={singleRoom.roomAmenities}
          onChange={handleChange}
        />
      </label>

     <h2 className="text-2xl font-bold mt-10 mb-4">Packages</h2>

<button
  type="button"
  className="px-4 py-2 bg-black text-white rounded-lg"
  onClick={() => setShowPackageModal(true)}
>
  + Add Package
</button>

<div className="mt-4 space-y-3">
  {singleRoom.packages.map((pkg) => (
    <div key={pkg.id} className="p-3 border rounded-lg bg-gray-50">
      <p className="font-semibold">{pkg.name}</p>
      <p className="text-sm">{pkg.description}</p>
      <p className="text-sm font-bold">৳ {pkg.price}</p>

      <button
        className="mt-2 text-red-600 text-sm"
        onClick={() =>
          setSingleRoom((prev) => ({
            ...prev,
            packages: prev.packages.filter((p) => p.id !== pkg.id),
          }))
        }
      >
        Remove
      </button>
    </div>
  ))}
</div>


      <h2 className="text-2xl font-bold mt-10 mb-4">Basic Information</h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          "size",
          "capacity",

          "floorInformation",
          "view",

        ].map((field) => (
          <label key={field} className="block capitalize">
            {field.replace(/([A-Z])/g, " $1")}
            <input
              name={field}
              className="input-white"
              value={singleRoom[field as keyof SingleRoomType] as string}
              onChange={handleChange}
            />
          </label>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-2">Available Dates</h2>
      <div className="grid grid-cols-2 gap-4">
        <label>
          Start Date
          <input
            type="date"
            name="availableStart"
            className="input-white"
            value={singleRoom.availableStart}
            onChange={handleChange}
          />
        </label>
        <label>
          End Date
          <input
            type="date"
            name="availableEnd"
            className="input-white"
            value={singleRoom.availableEnd}
            onChange={handleChange}
          />
        </label>
      </div>

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

      {showPackageModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999] p-4">
    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-black">Add Package</h2>

      <label className="block mb-2 text-sm font-semibold">Package Name</label>
      <input
        className="input-white"
        value={packageForm.name}
        onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
      />

      <label className="block mt-4 mb-2 text-sm font-semibold">Description</label>
      <textarea
        className="input-white h-24"
        value={packageForm.description}
        onChange={(e) =>
          setPackageForm({ ...packageForm, description: e.target.value })
        }
      />

      <label className="block mt-4 mb-2 text-sm font-semibold">Price</label>
      <input
        type="number"
        className="input-white"
        value={packageForm.price}
        onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 border rounded-lg"
          onClick={() => {
            setShowPackageModal(false);
            setPackageForm({ name: "", description: "", price: "" });
          }}
        >
          Cancel
        </button>

        <button
          className="px-5 py-2 bg-black text-white rounded-lg"
          onClick={() => {
            const newPackage: PackageType = {
              id: Date.now().toString(),
              name: packageForm.name,
              description: packageForm.description,
              price: Number(packageForm.price),
            };

            setSingleRoom((prev) => ({
              ...prev,
              packages: [...prev.packages, newPackage],
            }));

            setPackageForm({ name: "", description: "", price: "" });
            setShowPackageModal(false);
          }}
        >
          Add Package
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}




 