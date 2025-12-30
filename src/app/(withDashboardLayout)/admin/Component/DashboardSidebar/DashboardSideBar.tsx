"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";

import { usePathname, useRouter } from "next/navigation";
import {
  FaHome, FaDesktop, FaSignOutAlt, FaChartLine, FaMobileAlt, FaMedal, FaFileAlt, FaGift,
  FaPenFancy, FaShoppingCart, FaClipboardList, FaLayerGroup, FaTags, FaCertificate, FaCog,
  FaTasks, FaShoppingBag, FaHeart, FaAward
} from "react-icons/fa";
import { ChevronRight } from "lucide-react";

interface SidebarProps {
  setIsOpenSidebar: (value: boolean) => void;
}
interface SidebarItem {
  key: string;
  title: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>; // Type-safe icon
  role?: string[];
  permissionKey?: string;
  links: {
    title: string;
    icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
    path: string;
  }[];
}

interface User {
  role?: string[] | string;
  newpartroles?: string[] | string;
  roles?: string[] | string;
  permissions?: { [key: string]: boolean }; // true/false permission
}



const sidebarItems: SidebarItem[] = [
  {
    key: "Role Management",
    title: "Role Management",
    icon: FaDesktop,
    permissionKey: "rolemanagement",
    role: ["SUPERadmin"],
    links: [
      { title: "Super Admin", icon: FaDesktop, path: "/admin/dashboard/superadmin" },
      { title: "Add Role", icon: FaPenFancy, path: "/admin/dashboard/addrole" },
      { title: "Create User", icon: FaMobileAlt, path: "/admin/dashboard/register" },
    ],
  },
  {
    key: "Inventory Management",
    title: "Inventory Management",
    permissionKey: "Inventory",
    icon: FaLayerGroup,
    role: ["SUPERadmin"],
    links: [
      { title: "Room Upload", icon: FaDesktop, path: "/admin/dashboard/roomupload" },
      { title: "Restaurant Upload", icon: FaGift, path: "/admin/dashboard/resturantupload" },
      { title: "Bouquet Upload", icon: FaMedal, path: "/admin/dashboard/bouquetupload" },
      { title: "Fitness Upload", icon: FaMobileAlt, path: "/admin/dashboard/fitnessupload" },
      { title: "Gallery Upload", icon: FaFileAlt, path: "/admin/dashboard/galleryupload" },
    ],
  },
  {
    key: "Landingpage Management",
    title: "Landingpage Management",
    permissionKey: "LandingPage",
    icon: FaDesktop,
    links: [
      { title: "Banner/Video Upload", icon: FaFileAlt, path: "/admin/dashboard/addbanner" },
      { title: "Features Upload", icon: FaMedal, path: "/admin/dashboard/showfeatures" },
      { title: "Landing Room Upload", icon: FaGift, path: "/admin/dashboard/showlandingroom" },
      { title: "Bouquet Upload", icon: FaPenFancy, path: "/admin/dashboard/showlandingbouquet" },
      { title: "Restaurant Upload", icon: FaDesktop, path: "/admin/dashboard/showlandingresturant" },
      { title: "Instagram Upload", icon: FaMobileAlt, path: "/admin/dashboard/showinstragram" },
      { title: "Special Offer Upload", icon: FaGift, path: "/admin/dashboard/addspecialoffer" },
      { title: "Show Location", icon: FaDesktop, path: "/admin/dashboard/addlocation" },
    ],
  },
  {
    key: "Report Management",
    title: "Report Management",
    icon: FaClipboardList,
    permissionKey: "Reportmanagement",
    role: ["SUPERadmin"],
    links: [
      { title: "Show Room", icon: FaDesktop, path: "/admin/dashboard/showroomdata" },
      { title: "Show Restaurant", icon: FaGift, path: "/admin/dashboard/showresturant" },
      { title: "Show Bouquet", icon: FaMedal, path: "/admin/dashboard/showbouquet" },
      { title: "Show Fitness", icon: FaMobileAlt, path: "/admin/dashboard/showfitnessdata" },
      { title: "Show Gallery", icon: FaFileAlt, path: "/admin/dashboard/showgallerydata" },
    ],
  },
  {
    key: "Room Booking Management",
    title: "Room Booking Management",
    icon: FaShoppingCart,
    permissionKey: "Roommanagement",
    role: ["SUPERadmin"],
    links: [
      { title: "Pending Booking", icon: FaClipboardList, path: "/admin/dashboard/pendingbooking" },
      { title: "All Booking", icon: FaLayerGroup, path: "/admin/dashboard/allroombook" },
    ],
  },
  {
    key: "Bouquet Booking Management",
    title: "Bouquet Booking Management",
    icon: FaShoppingCart,
    permissionKey: "Bouquetmanagement",
    role: ["SUPERadmin"],
    links: [
      { title: "Pending Booking", icon: FaClipboardList, path: "/admin/dashboard/bouquetpending" },
      { title: "All Booking", icon: FaLayerGroup, path: "/admin/dashboard/allbouquetbook" },
    ],
  },
  {
    key: "Company Settings",
    title: "Company Settings",
    icon: FaCog,
    permissionKey: "CompanySettings",
    role: ["SUPERadmin"],
    links: [
      { title: "Show About Us", icon: FaDesktop, path: "/admin/dashboard/addaboutus" },
      { title: "Show Whats New", icon: FaPenFancy, path: "/admin/dashboard/addwhatsnew" },
      { title: "Show Contact Us", icon: FaMobileAlt, path: "/admin/dashboard/addcontactus" },
      { title: "Show Offer", icon: FaMobileAlt, path: "/admin/dashboard/adminspecialofferpost" },
    ],
  },
];

export default function DashboardSideBar({ setIsOpenSidebar }: SidebarProps) {
   const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<User | null>(null);
const [activeChild, setActiveChild] = useState(""); 
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Permission check function
 const canSee = (item: SidebarItem) => {
  if (!user) return false;

  const rawRoles =
    user.newpartroles || user.role || user.roles || [];

  const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles];
  const permissions = user.permissions || {};

  // 🟢 SUPERadmin → everything
  if (roles.includes("SUPERadmin")) {
    return true;
  }

  // 🟡 USER → only user menu
  if (roles.includes("user")) {
    return item.role?.includes("user") ?? false;
  }

  // 🔵 ADMIN / OTHER ROLES
  if (!item.permissionKey) return true;

  // ✅ permission object থাকলেই allow
  return permissions[item.permissionKey] !== undefined;
};



  if (!user) return null; // prevent hydration error

  return (
    <div className="w-full overflow-hidden bg-white shadow h-full">
      <section className="flex flex-col gap-2 p-2">
        <Link href="/" onClick={() => setIsOpenSidebar(false)}>
          <div className="flex items-center gap-2 font-bold p-3 mt-4 hover:scale-105 transition-transform duration-200">
            <FaHome className="text-xl text-[#007cde]" />
            <span className="font-semibold text-gray-900">Visit Site</span>
          </div>
        </Link>

         <Link href="/admin/dashboard" onClick={() => setIsOpenSidebar(false)}>
          <div className="flex items-center ms-2 gap-2 font-bold p-3 mt-4 hover:scale-105 transition-transform duration-200">
            <FaHome className="text-xl text-[#007cde]" />
            <span className="font-semibold text-gray-900">Home</span>
          </div>
        </Link>

        {sidebarItems.map(item => {
          if (!canSee(item)) return null;

          return (
          <div key={item.key} className="grid overflow-hidden transition-all duration-300 ease-in-out">
  <div className="overflow-hidden">
    <div
      onClick={() => toggleSection(item.key)}
      className={`cursor-pointer border-l-[3px] ${
        openSections[item.key] ? "border-[#007cde]" : "border-transparent"
      }`}
    >
      <div className="ml-2 flex items-center justify-between bg-white hover:bg-gray-50 p-2 rounded-md transition-all duration-200">
        <div className="flex items-center gap-2">
          <item.icon
            className={`text-[18px] ${
              openSections[item.key] ? "text-gray-500" : "text-[#007cde]"
            } transition-colors`}
          />
          <h4
            className={`font-medium text-sm ${
              openSections[item.key] ? "text-[#007cde]" : "text-gray-900"
            }`}
          >
            {item.title}
          </h4>
        </div>
        <ChevronRight
          size={16}
          className={`text-[#007cde] transition-transform duration-300 ${
            openSections[item.key] ? "rotate-90" : ""
          }`}
        />
      </div>
    </div>

    {/* Child links */}
    <div
      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
        openSections[item.key] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden font-semibold ms-5">
        {item.links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => {
              setIsOpenSidebar(false);
              setActiveChild(link.path); // mark this child as active
            }}
            className={`ml-3 mt-2 pr-0 flex items-center gap-2 border-l-[3px] p-1 rounded duration-300
              ${activeChild === link.path ? "bg-[#007cde]/20 border-[#007cde]" : "border-transparent bg-white"}`}
          >
            {link.icon && <link.icon className="text-sm text-[#01c0c9]" />}
            <span
              className={`font-semibold ${
                activeChild === link.path ? "text-[#007cde]" : "text-gray-900"
              }`}
            >
              {link.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </div>
</div>
          );
        })}

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
          className="flex ms-5 text-black font-bold items-center gap-2 text-[20px] hover:scale-105 transition-transform duration-200 mt-4"
        >
          <FaSignOutAlt className="mt-1" /> LogOut
        </button>
      </section>
    </div>
  );
}
