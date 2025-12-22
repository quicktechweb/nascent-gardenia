"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
}

export default function LocationPage() {
  const [placesData, setPlacesData] = useState<LocationData | null>(null);
  const [index, setIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!placesData) return;
    const interval = setInterval(() => {
      setIndex((prev) =>
        placesData ? (prev + 1) % placesData.places.length : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [placesData]);

  const fetchData = async () => {
    try {
      const res = await fetch("https://nascent.virtualshopbd.com/api/location");
      const data: LocationData[] = await res.json();
      if (data.length > 0) setPlacesData(data[0]); // only first location
    } catch (err) {
      console.error("Failed to fetch location data:", err);
    }
  };

  

  if (!placesData) return <p className="text-center mt-10">Loading...</p>;

  const extendedPlaces = [...placesData.places, ...placesData.places];

  return (
    <div className="w-full bg-[#e9e0d9] py-24 relative overflow-hidden">

      {/* Title */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl tracking-widest font-serif mb-12 text-center text-[#2d2926]">
        LOCATION
      </h2>

      {/* Map Section */}
      <div className="w-full max-w-6xl mx-auto mb-16 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <iframe
          src={placesData.mapUrl}
          className="w-full h-[500px] border-0"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>

      {/* Image slider + info */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-2 -mt-4">
        {/* Left: Slider */}
        <div className="flex-[2] overflow-hidden relative rounded-xl">
          <h3 className="text-center text-3xl mt-5 text-black mb-3 tracking-wider">
            •NEARBY PLACES•
          </h3>

          <div
            ref={sliderRef}
            className="flex gap-2 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${index * (280 + 8)}px)`,
            }}
          >
            {extendedPlaces.map((place, i) => (
              <div
                key={i}
                className="w-72 flex-shrink-0 mt-7 text-center bg-white rounded-xl hover:scale-105 transform transition-all duration-200"
              >
                <Image
                  src={place.image}
                  alt={place.name}
                  width={280}
                  height={160}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="p-2">
                  <h3 className="text-sm font-sans text-black leading-tight">{place.name}</h3>
                  <p className="text-xs text-gray-600 mt-0.5 leading-tight">{place.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col gap-2 md:mt-16">
          {placesData.distances.map((d, i) => (
            <div key={i} className="flex flex-col justify-center p-3 rounded-xl">
              <h4 className="text-[10px] tracking-wider text-black mt-3">{d.name}</h4>
              <p className="text-xs text-black leading-tight mb-1">{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
