"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/* ================= TYPES ================= */
interface Booking {
  _id: string;
  totalPrice?: number;
  createdAt: string;
  source: "room" | "bouquet";
}

/* ================= MONTHS ================= */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ================= COMPONENT ================= */
export default function DashboardSalesCharts() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  /* ================= FETCH ================= */
  /* ================= FETCH ================= */
useEffect(() => {
  const fetchData = async () => {
    const [roomRes, bouquetRes] = await Promise.all([
      axios.get<{ bookings: Omit<Booking, "source">[] }>("https://nascent.virtualshopbd.com/api/booking/all"),
      axios.get<{ bookings: Omit<Booking, "source">[] }>("https://nascent.virtualshopbd.com/api/bouquetbooking/all"),
    ]);

    const rooms: Booking[] = roomRes.data.bookings.map((b) => ({
      ...b,
      source: "room",
    }));

    const bouquets: Booking[] = bouquetRes.data.bookings.map((b) => ({
      ...b,
      source: "bouquet",
    }));

    setBookings([...rooms, ...bouquets]);
  };

  fetchData();
}, []);


  /* ================= LAST 4 MONTHS ================= */
  const last4Months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 4 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (3 - i), 1);
      return {
        label: MONTHS[d.getMonth()],
        month: d.getMonth(),
        year: d.getFullYear(),
      };
    });
  }, []);

  /* ================= BAR DATA ================= */
  const monthlyBarData = useMemo(() => {
    return last4Months.map(({ label, month, year }) => {
      let room = 0;
      let bouquet = 0;

      bookings.forEach((b) => {
        const d = new Date(b.createdAt);
        if (d.getMonth() === month && d.getFullYear() === year) {
          const price = Number(b.totalPrice) || 0;
          if (b.source === "room") room += price;
          if (b.source === "bouquet") bouquet += price;
        }
      });

      return {
        month: label,
        Room: room,
        Bouquet: bouquet,
      };
    });
  }, [bookings, last4Months]);

  /* ================= GRAND TOTAL ================= */
  const roomTotal = useMemo(
    () =>
      bookings
        .filter((b) => b.source === "room")
        .reduce((s, b) => s + (Number(b.totalPrice) || 0), 0),
    [bookings]
  );

  const bouquetTotal = useMemo(
    () =>
      bookings
        .filter((b) => b.source === "bouquet")
        .reduce((s, b) => s + (Number(b.totalPrice) || 0), 0),
    [bookings]
  );

  const pieData = [
    { name: "Room", value: roomTotal },
    { name: "Bouquet", value: bouquetTotal },
  ];

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ===== LAST 4 MONTH BAR CHART ===== */}
        <ChartCard title="User Activity (Last 4 Months)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyBarData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />

  <Bar
    dataKey="Room"
    fill="#0f3333" // changed to green
    radius={[6, 6, 0, 0]}
  />
  <Bar
    dataKey="Bouquet"
    fill="#c78436" // changed to purple
    radius={[6, 6, 0, 0]}
  />
</BarChart>

          </ResponsiveContainer>
        </ChartCard>

        {/* ===== GRAND TOTAL PIE ===== */}
        <ChartCard title="Grand Total">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
  <Pie
    data={pieData}
    dataKey="value"
    nameKey="name"
    innerRadius={60}
    outerRadius={100}
    paddingAngle={5}
  >
    <Cell fill="#0f3333" /> {/* Room */}
    <Cell fill="#c78436" />  {/* Bouquet */}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>

          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

/* ================= CARD ================= */
function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[360px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="h-[280px]">{children}</div>
    </div>
  );
}
