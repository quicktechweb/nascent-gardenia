"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Place {
  name: string;
  image: string;
  desc: string;
  _id?: string;
}

interface Distance {
  name: string;
  value: string;
  _id?: string;
}

interface LocationData {
  mapUrl: string;
  distances: Distance[];
  places: Place[];
  _id?: string;
}

export default function LocationPage() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<{
    type: "mapUrl" | "distance" | "place";
    index?: number; // distanceIndex or placeIndex
  } | null>(null);

  const [editData, setEditData] = useState<any>({});
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get<LocationData[]>("https://nascent.virtualshopbd.com/api/location");
      if (res.data.length > 0) setLocations(res.data);
      else setLocations([{ mapUrl: "", distances: [{ name: "", value: "" }], places: [{ name: "", image: "", desc: "" }] }]);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (
    locIndex: number,
    type: "mapUrl" | "distance" | "place",
    index?: number
  ) => {
    setCurrentLocationIndex(locIndex);
    setCurrentSection({ type, index });

    if (type === "mapUrl") setEditData({ mapUrl: locations[locIndex].mapUrl });
    else if (type === "distance" && index !== undefined)
      setEditData({ name: locations[locIndex].distances[index].name, value: locations[locIndex].distances[index].value });
    else if (type === "place" && index !== undefined)
      setEditData({
        name: locations[locIndex].places[index].name,
        desc: locations[locIndex].places[index].desc,
        image: locations[locIndex].places[index].image,
      });

    setEditFile(null);
    setEditModalOpen(true);
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await axios.post(
      "https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c",
      fd
    );
    return res.data.data.url;
  };

  const handleEditSave = async () => {
  if (currentLocationIndex === null || !currentSection) return;
  const newLocations = [...locations];

  // Update local state
  if (currentSection.type === "mapUrl") {
    newLocations[currentLocationIndex].mapUrl = editData.mapUrl;
  } else if (currentSection.type === "distance" && currentSection.index !== undefined) {
    newLocations[currentLocationIndex].distances[currentSection.index] = {
      ...newLocations[currentLocationIndex].distances[currentSection.index],
      name: editData.name,
      value: editData.value,
    };
  } else if (currentSection.type === "place" && currentSection.index !== undefined) {
    if (editFile) {
      const url = await uploadImage(editFile);
      editData.image = url;
    }
    newLocations[currentLocationIndex].places[currentSection.index] = {
      ...newLocations[currentLocationIndex].places[currentSection.index],
      ...editData,
    };
  }

  setLocations(newLocations);
  setEditModalOpen(false);
  setEditData({});
  setEditFile(null);

  // Send PUT request to backend
  const locationId = newLocations[currentLocationIndex]._id;
  if (locationId) {
    try {
      await axios.put(`https://nascent.virtualshopbd.com/api/location/${locationId}`, newLocations[currentLocationIndex]);
      alert("Location updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update location");
    }
  }
};


  const handleSaveAll = async () => {
    try {
      await axios.post("https://nascent.virtualshopbd.com/api/location", locations);
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  return (
    <div className="p-8 space-y-6 text-black">
      {locations.map((loc, i) => (
        <div key={i} className="border p-4 rounded-lg space-y-4 bg-gray-50">
          {/* Map URL */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">Map URL</h3>
            <button onClick={() => openEditModal(i, "mapUrl")} className="bg-blue-500 text-white py-1 px-2 rounded text-xs">Edit</button>
          </div>
          <p className="text-xs break-all">{loc.mapUrl}</p>

          {/* Distances */}
          <div className="mt-2">
            <h3 className="font-semibold text-sm mb-1">Distances</h3>
            {loc.distances.map((d, di) => (
              <div key={di} className="border p-2 rounded space-y-1 bg-white flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold">Name: {d.name}</p>
                  <p className="text-xs">Value: {d.value}</p>
                </div>
                <button onClick={() => openEditModal(i, "distance", di)} className="bg-blue-500 text-white py-1 px-2 rounded text-xs">Edit</button>
              </div>
            ))}
          </div>

          {/* Places */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm mb-1">Places</h3>
            {loc.places.map((p, pi) => (
              <div key={pi} className="border p-2 rounded space-y-1 bg-white flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold">Name: {p.name}</p>
                  <img src={p.image} alt="place" className="w-16 h-16 object-cover rounded my-1"/>
                  <p className="text-xs">Description: {p.desc}</p>
                </div>
                <button onClick={() => openEditModal(i, "place", pi)} className="bg-blue-500 text-white py-1 px-2 rounded text-xs">Edit</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSaveAll} className="bg-green-500 text-white py-2 px-4 rounded mt-4">Save All</button>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-96 space-y-4">
            <h3 className="font-semibold text-sm">Edit Section</h3>

            {currentSection?.type === "mapUrl" && (
              <input type="text" value={editData.mapUrl} onChange={(e) => setEditData({ mapUrl: e.target.value })} className="w-full border p-2 rounded" />
            )}

            {currentSection?.type === "distance" && (
              <>
                <label className="text-xs">Name</label>
                <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full border p-2 rounded" />
                <label className="text-xs">Value</label>
                <input type="text" value={editData.value} onChange={(e) => setEditData({ ...editData, value: e.target.value })} className="w-full border p-2 rounded" />
              </>
            )}

            {currentSection?.type === "place" && (
              <>
                <label className="text-xs">Name</label>
                <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full border p-2 rounded" />
                <label className="text-xs">Description</label>
                <textarea value={editData.desc} onChange={(e) => setEditData({ ...editData, desc: e.target.value })} className="w-full border p-2 rounded" rows={2} />
                <label className="text-xs">Image</label>
                <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setEditFile(e.target.files[0]); }} className="w-full" />
                {editData.image && !editFile && <img src={editData.image} alt="preview" className="w-16 h-16 object-cover rounded my-1"/>}
              </>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditModalOpen(false)} className="bg-gray-400 text-white py-1 px-3 rounded">Cancel</button>
              <button onClick={handleEditSave} className="bg-blue-500 text-white py-1 px-3 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
