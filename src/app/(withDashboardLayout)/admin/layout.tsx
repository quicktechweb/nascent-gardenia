"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import DashboardSideBar from "./Component/DashboardSidebar/DashboardSideBar";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="flex bg-white flex-row-reverse gap-4 relative min-h-screen">

      {/* Sidebar */}
      <div
        className={`${
          isOpenSidebar ? "w-[60%]" : "w-0 md:w-[20%]"
        } h-screen fixed top-0 left-0 bg-white z-50 overflow-y-scroll duration-300 transition-all ease-in-out`}
      >
        <div className="flex justify-end md:hidden p-4">
          <FaTimes
            onClick={() => setIsOpenSidebar(false)}
            className="text-2xl text-[#FF6600] cursor-pointer"
          />
        </div>

        <div className="w-full">
          <div className="hidden md:flex items-center gap-5 p-4 ms-10">
            <img
              className="w-24 h-20"
              src="https://i.ibb.co.com/nM82NyjS/NG-LOGO-BARIDHARA-icon.png"
              alt="Logo"
            />
          </div>
          <DashboardSideBar setIsOpenSidebar={setIsOpenSidebar} />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isOpenSidebar ? "w-[80%]" : "w-full md:w-[80%]"
        } ml-auto duration-300 transition-all ease-in-out`}
      >
        {/* Navbar */}
        <div className="flex justify-between shadow-2xl md:pl-16 py-4 md:py-1 px-4">
          <div className="flex items-center">
            {!isOpenSidebar && (
              <FaBars
                onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                className="block md:hidden text-2xl text-[#FF6600] mr-4"
              />
            )}
            <h2 className="text-black font-bold text-lg md:text-3xl">
              Dashboard
            </h2>
          </div>

          <div className="relative">
            <img
              src="https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_640.png"
              alt="Profile"
              className="w-8 md:w-12 h-8 md:h-12 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-lg font-semibold">
                    Profile Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-lg font-semibold">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
