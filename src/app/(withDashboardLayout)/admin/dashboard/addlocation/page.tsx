"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Place {
  name: string;
  image: string;
  desc: string;
}

interface Distance {
  name: string;
  value: string;
}

interface LocationData {
  mapUrl: string;
  distances: Distance[];
  places: Place[];
  _id?: string;
}

export default function LocationPage() {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get<LocationData[]>(
        "https://nascent.virtualshopbd.com/api/location"
      );
      if (res.data.length > 0) setLocations(res.data);
      else
        setLocations([
          {
            mapUrl: "",
            distances: [{ name: "", value: "" }],
            places: [{ name: "", image: "", desc: "" }],
          },
        ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceImageUpload = async (
    locIndex: number,
    placeIndex: number,
    file: File
  ) => {
    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=ab454291ebee91b49b021ecac51be17c",
        fd
      );

      const imageUrl = res.data.data.url;
      const newLocations = [...locations];
      newLocations[locIndex].places[placeIndex].image = imageUrl;
      setLocations(newLocations);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed!");
    }
  };

  const handleDistanceChange = (
    locIndex: number,
    distIndex: number,
    field: keyof Distance,
    value: string
  ) => {
    const newLocations = [...locations];
    newLocations[locIndex].distances[distIndex][field] = value;
    setLocations(newLocations);
  };

  const handlePlaceChange = (
    locIndex: number,
    placeIndex: number,
    field: keyof Place,
    value: string
  ) => {
    const newLocations = [...locations];
    newLocations[locIndex].places[placeIndex][field] = value;
    setLocations(newLocations);
  };

  const handleAddDistance = (locIndex: number) => {
    const newLocations = [...locations];
    newLocations[locIndex].distances.push({ name: "", value: "" });
    setLocations(newLocations);
  };

  const handleAddPlace = (locIndex: number) => {
    const newLocations = [...locations];
    newLocations[locIndex].places.push({ name: "", image: "", desc: "" });
    setLocations(newLocations);
  };

  const handleAddLocation = () => {
    setLocations([
      ...locations,
      {
        mapUrl: "",
        distances: [{ name: "", value: "" }],
        places: [{ name: "", image: "", desc: "" }],
      },
    ]);
  };

  const handleSave = async () => {
    try {
      await axios.post("https://nascent.virtualshopbd.com/api/location", locations);
      alert("Saved successfully!");
      setLocations([
        {
          mapUrl: "",
          distances: [{ name: "", value: "" }],
          places: [{ name: "", image: "", desc: "" }],
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  return (
    <div className="p-8 space-y-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold text-gray-800">Manage Locations</h1>

      {locations.map((loc, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-xl shadow-md space-y-6 border border-gray-200"
        >
          {/* Map URL */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Map URL</label>
            <input
              type="text"
              value={loc.mapUrl}
              onChange={(e) => {
                const newLocations = [...locations];
                newLocations[i].mapUrl = e.target.value;
                setLocations(newLocations);
              }}
              className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Distances */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Distances</h3>
            {loc.distances.map((d, di) => (
              <div
                key={di}
                className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <input
                  type="text"
                  placeholder="Distance Name"
                  value={d.name}
                  onChange={(e) =>
                    handleDistanceChange(i, di, "name", e.target.value)
                  }
                  className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={d.value}
                  onChange={(e) =>
                    handleDistanceChange(i, di, "value", e.target.value)
                  }
                  className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
            <button
              onClick={() => handleAddDistance(i)}
              className="bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500 transition"
            >
              + Add Distance
            </button>
          </div>

          {/* Places */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Places</h3>
            {loc.places.map((p, pi) => (
              <div
                key={pi}
                className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-md border border-gray-200 items-start"
              >
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Place Name"
                    value={p.name}
                    onChange={(e) =>
                      handlePlaceChange(i, pi, "name", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <textarea
                    placeholder="Description"
                    value={p.desc}
                    onChange={(e) =>
                      handlePlaceChange(i, pi, "desc", e.target.value)
                    }
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={2}
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePlaceImageUpload(i, pi, e.target.files[0]);
                      }
                    }}
                    className="border border-gray-300 p-2 rounded-md"
                  />
                  {p.image && (
                    <img
                      src={p.image}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => handleAddPlace(i)}
              className="bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500 transition"
            >
              + Add Place
            </button>
          </div>
        </div>
      ))}

      {/* Bottom Buttons */}
      <div className="flex gap-4">
        {/* <button
          onClick={handleAddLocation}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          + Add Location
        </button> */}
        <button
          onClick={handleSave}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
        >
          Save All
        </button>
      </div>
    </div>
  );
}
