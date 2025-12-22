"use client";

import { useEffect, useState } from "react";
import axios from "axios";


const uploadToImgbb = async (file: File) => {
  const fd = new FormData();
  fd.append("image", file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c`,
    fd
  );

  return res.data.data.url;
};
interface SingleAvailableDate {
  start: string;
  end: string;
  _id: string;
}

interface BasicInfo {
  bedType: string;
  size: string;
  capacity: number;
  numberOfRooms: number;
  bedSize: string;
  floorInformation: string;
  view: string;

  extraBed: string;
  connectingRoom: string;
  _id: string;
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
  basicInfo: BasicInfo;
  availableDates: SingleAvailableDate[];
  _id: string;

  heroImage?: string;
  herotext?: string;
  herodescription?: string;

  roomheader?: string;
  roomshorttile?: string;
  roomshortdescription?: string;

  parentId?: string;
}


interface RoomData {
  _id: string;
  heroImage: string;
  herotext: string;          // 🔥 ADD THIS
  roomshortdescription: string;          // 🔥 ADD THIS
  roomheader: string;          // 🔥 ADD THIS
  roomshorttile: string;          // 🔥 ADD THIS
  herodescription: string;   // 🔥 ADD THIS
  roomsdata: RoomObject[];
}


export default function RoomsTable() {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRoom, setEditRoom] = useState<RoomObject | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("https://nascent.virtualshopbd.com/api/bouquet");
      if (res.data.success) setRooms(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`https://nascent.virtualshopbd.com/api/bouquet/${roomId}`);
      setRooms(rooms?.map(room => ({
        ...room,
        roomsdata: room.roomsdata.filter(r => r._id !== roomId)
      })));
      alert("Room deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting room.");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editRoom) return;
    setEditRoom({ ...editRoom, [e.target.name]: e.target.value });
  };

 const handleEditSave = async () => {
  if (!editRoom || !editRoom.parentId) return;

  try {
    await axios.put(`https://nascent.virtualshopbd.com/api/bouquet/updateRootAndFirst/${editRoom.parentId}`, {
      heroImage: editRoom.heroImage,
      herotext: editRoom.herotext,
      roomshorttile: editRoom.roomshorttile,
      roomshortdescription: editRoom.roomshortdescription,
      roomheader: editRoom.roomheader,
      herodescription: editRoom.herodescription,

      firstRoom: {
        ...editRoom,
        basicInfo: { ...editRoom.basicInfo },
        availableDates: [...editRoom.availableDates],
        carouselImages: [...editRoom.carouselImages],
        facilities: [...editRoom.facilities],
      }
    });

    fetchRooms();
    setEditRoom(null);
    alert("Updated Successfully!");
  } catch (error) {
    console.log(error);
    alert("Update failed");
  }
};




  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 bg-white text-black min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Show Bouquet All Data</h2>

   <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
  <table className="min-w-full table-auto border-collapse text-gray-800 text-sm md:text-base">
    {/* ===== TABLE HEADER ===== */}
    <thead className="bg-gradient-to-r from-[#c78436] to-[#a6712e] text-white sticky top-0 z-10">
      <tr>
        {[
          "HeroImage",
          "Herotext",
          "Roomshorttile",
          "Roomheader",
          "Herodescription",
          "Title",
          "BouquetType",
          "CarouselImage",
          "Actions",
        ].map((h, i) => (
          <th
            key={i}
            className="px-4 py-3 text-left font-semibold uppercase tracking-wide border-r last:border-r-0 text-lg"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>

    {/* ===== TABLE BODY ===== */}
    <tbody className="bg-white divide-y divide-gray-200">
      {rooms?.map((room, roomIndex) => {
        const first = room.roomsdata[0];
        return (
          <tr key={first._id} className="hover:bg-gray-50 transition duration-200">
            {/* ===== PARENT DATA ===== */}
            {roomIndex === 0 ? (
              <>
                <td className="px-3 py-3">
                  <img
                    src={room.heroImage}
                    className="w-28 h-16 object-cover rounded-lg shadow-md"
                  />
                </td>
                <td className="px-3 py-3 font-semibold text-lg">{room.herotext}</td>
                <td className="px-3 py-3">{room.roomshorttile}</td>
                <td className="px-3 py-3">{room.roomheader}</td>
                <td className="px-3 py-3">{room.herodescription}</td>
              </>
            ) : (
              Array.from({ length: 5 }).map((_, i) => (
                <td key={i} className="px-3 py-3"></td>
              ))
            )}

            {/* ===== CHILD ROOM DATA ===== */}
            <td className="px-3 py-3 font-medium">{first.title}</td>
            <td className="px-3 py-3">{first.roomType}</td>

            {/* ===== CAROUSEL IMAGES ===== */}
            <td className="px-3 py-3">
              <div className="grid grid-cols-2 gap-2">
                {first.carouselImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="w-full h-14 object-cover rounded shadow-sm"
                  />
                ))}
              </div>
            </td>

            {/* ===== ACTION BUTTON ===== */}
            <td className="px-3 py-3 mt-2 flex justify-center items-center ">
              <button
                className="bg-gradient-to-r from-[#c78436] to-[#a6712e] hover:from-[#d39f4a] hover:to-[#b37b2a] text-white px-4 py-2 rounded-lg font-semibold shadow-md transition duration-200"
                onClick={() =>
                  setEditRoom({
                    ...first,
                    heroImage: room.heroImage,
                    herotext: room.herotext,
                    roomshorttile: room.roomshorttile,
                    roomshortdescription: room.roomshortdescription,
                    roomheader: room.roomheader,
                    herodescription: room.herodescription,
                    parentId: room._id,
                  })
                }
              >
                Edit
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>



      {/* EDIT MODAL */}
    {/* EDIT MODAL */}
{editRoom && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative bg-white text-black p-12 rounded-lg w-2/3 max-h-[90vh] overflow-y-auto">
      {/* CLOSE BUTTON */}
      <button
        className="absolute top-2 right-2 text-white bg-red-600 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-700"
        onClick={() => setEditRoom(null)}
      >
        ×
      </button>

      <h3 className="text-2xl font-bold mb-4">Edit Room: {editRoom.title}</h3>

      <div className="grid grid-cols-2 gap-4">

        {/* 🔥 Show parent fields only for the first room */}
        {editRoom.parentId && rooms[0]?._id === editRoom.parentId && (
          <>
            <div className="col-span-2">
              <label className="font-semibold">Hero Image</label>
              {editRoom.heroImage && (
                <img src={editRoom.heroImage} className="w-48 h-32 object-cover rounded border my-2" alt="hero" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (!e.target.files) return;
                  const url = await uploadToImgbb(e.target.files[0]);
                  setEditRoom({ ...editRoom, heroImage: url });
                }}
              />
            </div>

            <div className="col-span-2">
              <label>Hero Text</label>
              <input
                name="herotext"
                value={editRoom.herotext || ""}
                onChange={handleEditChange}
                className="input-white"
              />
            </div>

            <div className="col-span-2">
              <label>Room Short Title</label>
              <input
                name="roomshorttile"
                value={editRoom.roomshorttile || ""}
                onChange={handleEditChange}
                className="input-white"
              />
            </div>

            <div className="col-span-2">
              <label>Room Header</label>
              <input
                name="roomheader"
                value={editRoom.roomheader || ""}
                onChange={handleEditChange}
                className="input-white"
              />
            </div>

            <div className="col-span-2">
              <label>Room Short Description</label>
              <textarea
                name="roomshortdescription"
                value={editRoom.roomshortdescription || ""}
                onChange={handleEditChange}
                className="input-white h-20"
              />
            </div>

            <div className="col-span-2">
              <label>Hero Description</label>
              <textarea
                name="herodescription"
                value={editRoom.herodescription || ""}
                onChange={handleEditChange}
                className="input-white h-20"
              />
            </div>
          </>
        )}

        {/* 🔥 All other fields (always shown) */}
        <div>
          <label>Title</label>
          <input name="title" value={editRoom.title} onChange={handleEditChange} className="input-white" />
        </div>

        <div>
          <label>Room Type</label>
          <input name="roomType" value={editRoom.roomType} onChange={handleEditChange} className="input-white" />
        </div>

        <div>
          <label>Background Color</label>
          <input name="bgColor" type="color" value={editRoom.bgColor} onChange={handleEditChange} className="w-full h-12" />
        </div>

        <div className="col-span-2">
          <label>Description</label>
          <textarea name="description" value={editRoom.description} onChange={handleEditChange} className="input-white h-24" />
        </div>

        <div className="col-span-2">
          <label>Room Amenities</label>
          <textarea name="roomAmenities" value={editRoom.roomAmenities} onChange={handleEditChange} className="input-white h-24" />
        </div>

        {/* Carousel Images */}
        <div className="col-span-2">
          <label>Carousel Images</label>
          <div className="flex gap-2 flex-wrap my-2">
            {editRoom?.carouselImages?.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="w-24 h-24 object-cover rounded border" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  onClick={() => {
                    const newImgs = [...editRoom.carouselImages];
                    newImgs.splice(i, 1);
                    setEditRoom({ ...editRoom, carouselImages: newImgs });
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={async (e) => {
              if (!e.target.files) return;
              const urls: string[] = [];
              for (let i = 0; i < e.target.files.length; i++) {
                const url = await uploadToImgbb(e.target.files[i]);
                urls.push(url);
              }
              setEditRoom({ ...editRoom, carouselImages: [...editRoom.carouselImages, ...urls] });
            }}
          />
        </div>

        {/* Facilities */}
        <div className="col-span-2">
          <label>Facilities (comma separated)</label>
          <textarea
            name="facilities"
            value={editRoom.facilities.join(",")}
            onChange={(e) =>
              setEditRoom({ ...editRoom, facilities: e.target.value.split(",") })
            }
            className="input-white h-20"
          />
        </div>

        {/* Basic Info */}
        <div className="col-span-2 mt-4">
          <h3 className="text-xl font-bold mb-2">Basic Info</h3>
        </div>

        {(Object.keys(editRoom?.basicInfo) as (keyof BasicInfo)[])?.map((key) =>
          key !== "_id" && (
            <div key={key}>
              <label>{key}</label>
              <input
                value={editRoom.basicInfo[key]}
                onChange={(e) =>
                  setEditRoom({
                    ...editRoom,
                    basicInfo: { ...editRoom.basicInfo, [key]: e.target.value },
                  })
                }
                className="input-white"
              />
            </div>
          )
        )}

        {/* Available Dates */}
        <div className="col-span-2 mt-4">
          <h3 className="text-xl font-bold mb-2">Available Dates</h3>
        </div>

        {editRoom.availableDates?.map((d, index) => (
          <div className="col-span-2 flex gap-4" key={d._id}>
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={d.start}
                onChange={(e) => {
                  const newDates = [...editRoom.availableDates];
                  newDates[index].start = e.target.value;
                  setEditRoom({ ...editRoom, availableDates: newDates });
                }}
                className="input-white"
              />
            </div>

            <div>
              <label>End Date</label>
              <input
                type="date"
                value={d.end}
                onChange={(e) => {
                  const newDates = [...editRoom.availableDates];
                  newDates[index].end = e.target.value;
                  setEditRoom({ ...editRoom, availableDates: newDates });
                }}
                className="input-white"
              />
            </div>
          </div>
        ))}

      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3 mt-4">
        <button className="bg-gray-400 text-black px-4 py-2 rounded" onClick={() => setEditRoom(null)}>
          Cancel
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleEditSave}>
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}




      <style jsx>{`
        .input-white {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-top: 4px;
          background: white;
          color: black;
        }
      `}</style>
    </div>
  );
}
