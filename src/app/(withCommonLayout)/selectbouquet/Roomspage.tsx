"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";

type DateRange = {
  start: string;
  end: string;
};

type BasicInfo = {
  bedType: string;
  capacity: number;
  size: string;
};

type Room = {
  id: string;
  title: string;
  description: string;
  roomType: string;
  basicInfo: BasicInfo;
  carouselImages: string[];
  availableDates: DateRange[];
  packages?: {
    id: string;
    name: string;
    description: string;
    price: number;
  }[];
};

type CartItem = {
  roomId: string;
  roomTitle: string;
  packageId: string;
  packageName: string;
  price: number;
  quantity: number;
  arrival: string;
  departure: string;
  serviceCharge: number;
  guests: number; // new field
};

type RoomAPIResponse = {
  roomsdata: Room[];
};

type RoomPackage = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const arrival = searchParams.get("arrival") ?? "";
  const departure = searchParams.get("departure") ?? arrival;
  const guests = Number(searchParams.get("guests") || 1);
  const roomType = searchParams.get("roomType") || "";

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  const toNum = (d: string) => new Date(d).getTime();
  const SERVICE_CHARGE = 500;

  // LOCALSTORAGE INIT
const [cart, setCart] = useState<CartItem[]>([]); 

useEffect(() => {
  const saved = localStorage.getItem("hotel-cart");
  if (saved) setCart(JSON.parse(saved));
}, []);

useEffect(() => {
  if (cart.length > 0) {
    localStorage.setItem("hotel-cart", JSON.stringify(cart));
  } else {
    localStorage.removeItem("hotel-cart");
  }
}, [cart]);

// Save to localStorage when cart updates

  // Load cart from localStorage
  

  // Save cart to localStorage
  

  // Fetch rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("https://nascent.virtualshopbd.com/api/bouquet");
        const allRooms: Room[] = res.data.data.flatMap((item: RoomAPIResponse) => item.roomsdata);

        setRooms(allRooms);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  // Filter rooms
  useEffect(() => {
    if (!arrival || rooms.length === 0) return;
    const userStart = toNum(arrival);
    const userEnd = toNum(departure);

    const filtered = rooms.filter((room) => {
      if (room.basicInfo?.capacity < guests) return false;
      if (roomType && room.roomType !== roomType) return false;

      return room.availableDates?.some((range) => {
        const roomStart = toNum(range.start);
        const roomEnd = toNum(range.end);
        return userStart >= roomStart && userEnd <= roomEnd;
      });
    });
    setFilteredRooms(filtered);
  }, [arrival, departure, guests, roomType, rooms]);

  // Add to cart
  const addToCart = (room: Room, pkg: RoomPackage) => {
    const existing = cart.find(
      (item) =>
        item.roomId === room.id &&
        item.packageId === pkg.id &&
        item.arrival === arrival &&
        item.departure === departure
    );

    if (existing) {
      setCart((prev) =>
        prev.map((i) =>
          i.roomId === room.id &&
          i.packageId === pkg.id &&
          i.arrival === arrival &&
          i.departure === departure
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      const newItem: CartItem = {
        roomId: room.id,
        roomTitle: room.title,
        packageId: pkg.id,
        packageName: pkg.name,
        price: pkg.price,
        quantity: 1,
        arrival,
        departure,
        serviceCharge: SERVICE_CHARGE,
        guests,
      };
      setCart((prev) => [...prev, newItem]);
    }
  };

  const increaseQuantity = (item: CartItem) => {
    setCart((prev) =>
      prev.map((i) =>
        i.roomId === item.roomId &&
        i.packageId === item.packageId &&
        i.arrival === item.arrival &&
        i.departure === item.departure
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const decreaseQuantity = (item: CartItem) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.roomId === item.roomId &&
          i.packageId === item.packageId &&
          i.arrival === item.arrival &&
          i.departure === item.departure
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (item: CartItem) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(
            i.roomId === item.roomId &&
            i.packageId === item.packageId &&
            i.arrival === item.arrival &&
            i.departure === item.departure
          )
      )
    );
  };

 const totalRoomPrice = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const totalServiceCharge = cart.reduce(
  (sum, item) => sum + item.serviceCharge,
  0
);

const totalPrice = totalRoomPrice + totalServiceCharge;


  // Room Card
  const RoomCard = ({ room }: { room: Room }) => (
    <div className="w-full border-b pb-10 pt-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-[290px] md:w-[280px] h-[170px]">
          <Image
            src={room.carouselImages?.[0]}
            width={260}
            height={170}
            alt={room.title}
            className="rounded-sm w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 mt-4 md:mt-0">
          <h3 className="text-[20px] text-black font-[500]">{room.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-black">
            <button className="border px-3 py-[3px] text-[12px] rounded-sm">
              {room.basicInfo?.bedType} Beds
            </button>
          </div>
          <p className="text-[13px] text-gray-700 mt-2">
            {room.basicInfo?.bedType} Beds • Sleeps {room.basicInfo?.capacity} • {room.basicInfo?.size}
          </p>
          <p className="text-[13px] text-gray-600 mt-2 leading-[1.4]">{room.description}</p>
          <button className="text-[13px] underline mt-2 font-medium">Room Details</button>

          <div className="mt-6 space-y-8">
            {room.packages?.map((pkg) => (
              <div key={pkg.id} className="flex flex-col md:flex-row justify-between border-t pt-4">
                <div>
                  <h4 className="text-[13px] font-semibold text-[#7a5c3c] tracking-wide">{pkg.name}</h4>
                  <ul className="text-[13px] text-gray-700 mt-2 space-y-1 whitespace-pre-line">
                    {pkg.description.split("\n").map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>

                  {/* Mobile */}
                  <div className="mt-4 md:hidden text-left">
                    <p className="font-semibold text-[16px] text-black">৳ {pkg.price}</p>
                    <p className="text-[11px] text-gray-500">
                      Average Per Night <br /> Excluding taxes
                    </p>
                    <button
                      onClick={() => addToCart(room, pkg)}
                      className="mt-3 bg-[#a68a60] text-white text-[12px] px-4 py-2 rounded-sm"
                    >
                      BOOK NOW
                    </button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:block min-w-[150px] text-right">
                  <p className="font-semibold text-[16px] text-black">৳ {pkg.price}</p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    Average Per Night <br /> Excluding taxes
                  </p>
                  <button
                    onClick={() => addToCart(room, pkg)}
                    className="mt-3 bg-[#a68a60] text-white text-[12px] px-4 py-2 rounded-sm"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // MAIN RETURN
  return (
    <div className="w-full min-h-screen bg-[#F8F6F2] flex justify-center py-6">
      <div className="w-full max-w-7xl mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        <div className="lg:col-span-2">
          <h2 className="mt-6 mb-3 text-lg text-black font-semibold">Select Room</h2>
          {filteredRooms.length === 0 ? (
            <p className="text-red-500 text-5xl font-bold">No rooms available.</p>
          ) : (
            filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
          )}
        </div>

        {/* SIDEBAR CART */}
        <div className="space-y-6 hidden md:block w-full max-w-sm text-black mt-10">
          <div className="w-[360px] bg-white shadow-md p-5 rounded-md">
            <h3 className="text-[16px] mb-2 font-semibold">
              Your Cart: {cart.length} {cart.length === 1 ? "Item" : "Items"}
            </h3>

            {cart.length === 0 && (
              <div className="border p-4 mt-3 rounded-md text-gray-500">
                <div className="font-bold">No items in your cart</div>
                <div className="flex justify-between text-[14px] mt-2">
                  <span>Room Charges</span>
                  <span>৳ 0</span>
                </div>
                <div className="flex justify-between text-[14px] mt-1">
                  <span>Service Charge</span>
                  <span>৳ 0</span>
                </div>
                <div className="flex justify-between text-[14px] mt-1">
                  <span>Stay</span>
                  <span>—</span>
                </div>
              </div>
            )}

            {cart.map((item) => {
              const roomTotal = item.price * item.quantity;

              return (
                <div key={item.packageId} className="border p-4 mt-3 rounded-md">
                  <div className="font-bold">{item.roomTitle}</div>
                  <div className="text-sm text-gray-600">{item.packageName}</div>
                  <div className="flex justify-between text-[14px] mt-1">
  <span>Guests</span>
  <span>{item.guests}</span>
</div>


                  <div className="flex justify-between text-[14px] mt-2">
                    <span>Room Charges</span>
                    <span>৳ {roomTotal}</span>
                  </div>

                  <div className="flex justify-between text-[14px] mt-1">
                    <span>Service Charge</span>
                    <span>৳ {item.serviceCharge}</span>
                  </div>

                  <div className="flex justify-between text-[14px] mt-1">
                    <span>Stay</span>
                    <span>{item.arrival} → {item.departure}</span>
                  </div>

                  {/* Quantity Section */}
                  <div className="flex gap-3 mt-3 items-center">
                    <button
                      onClick={() => decreaseQuantity(item)}
                      className="px-3 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border rounded">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item)}
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item)}
                      className="px-4 py-1 border rounded text-red-600"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              );
            })}

            {/* TOTAL */}
            <div className="flex justify-between font-bold text-[16px] mt-4">
              <span>Total</span>
              <span>৳ {totalPrice}</span>
            </div>

            <p className="text-[12px] text-gray-500 mt-1">Including taxes and fees</p>

            {/* CHECKOUT */}
            <Link href="/bouquetcheckout">
              <button className="w-full flex items-center justify-center gap-2 bg-[#b89c5a] text-white py-3 rounded-md mt-4 text-sm">
                CHECKOUT
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
