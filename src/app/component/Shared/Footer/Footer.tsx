"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaWeixin, FaYoutube } from "react-icons/fa";
interface SocialLinks {
  facebook: string;
  instagram: string;
  wechat: string;
  youtube: string;
}

interface ContactInfo {
  address: string;
  googleMapLink: string;
  email: string;
  salesPhone: string;
  frontOfficePhone: string;
}

interface FooterData {
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
}

export default function Footer() {
   const [footerData, setFooterData] = useState<FooterData>({
    socialLinks: { facebook: "", instagram: "", wechat: "", youtube: "" },
    contactInfo: {
      address: "",
      googleMapLink: "",
      email: "",
      salesPhone: "",
      frontOfficePhone: "",
    },
  });

    const fetchFooter = async () => {
    try {
      const res = await axios.get("https://nascent.virtualshopbd.com/api/footer");
      if (res.data.success && res.data.footer) {
        setFooterData(res.data.footer);
      }
    } catch (err) {
      console.error("Fetch footer error:", err);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

    const { socialLinks, contactInfo } = footerData;

  return (
    <footer className="bg-gradient-to-b from-[#0f3333] via-[#0c0c0c] to-black text-white pt-16 pb-10 px-5 md:px-20">

      {/* TOP LOGO + TITLE */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 w-full max-w-7xl mx-auto text-center md:text-left">
        {/* Logo */}
        <div className="flex-shrink-0 flex justify-center md:block w-full md:w-auto">
          <Image
            src="https://i.ibb.co.com/nM82NyjS/NG-LOGO-BARIDHARA-icon.png"
            alt="logo"
            width={120}
            height={80}
            className="w-[120px] h-[80px] object-contain mx-auto md:mx-0"
          />
        </div>

        {/* Title */}
        <div className="w-full md:w-auto">
       

         <h2
  className="text-[#c78436] mt-2 text-4xl md:text-6xl font-semibold mb-14 
             text-center uppercase
             drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]
              inline-block pb-1"
  style={{
    fontFamily: "Trajan Pro, Cinzel, 'Times New Roman', serif",
    letterSpacing: "normal",
  }}
>
  NASCENT GARDENIA BARIDHARA
</h2>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-7xl -mt-3 mx-auto border-t border-[#c78436] my-7"></div>

      {/* THREE COLUMNS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 w-full max-w-7xl mx-auto text-sm text-center sm:text-left">

        {/* Socials */}
        <div>
          <h4 className="text-gray-400 text-xs tracking-widest mb-4">SOCIALS</h4>
          <ul className="space-y-2 text-gray-300">
            {socialLinks.facebook && (
              <li className="flex justify-center sm:justify-start items-center gap-2 hover:text-white cursor-pointer transition-colors duration-200">
                <FaFacebookF className="text-lg" />
                <Link href={socialLinks.facebook} target="_blank">Facebook</Link>
              </li>
            )}

             {socialLinks.instagram && (
               <li className="flex justify-center sm:justify-start items-center gap-2 hover:text-white cursor-pointer transition-colors duration-200">
              <FaInstagram className="text-lg" /> 
              <Link href={socialLinks.instagram} target="_blank">Instagram</Link>
            </li>
            )}

              {socialLinks.wechat && (
                <li className="flex justify-center sm:justify-start items-center gap-2 hover:text-white cursor-pointer transition-colors duration-200">
              <FaWeixin className="text-lg" /> 
              <Link href={socialLinks.wechat} target="_blank">Wechat</Link>
            </li>
            )}
           
          
            {socialLinks.youtube && (
              <li className="flex justify-center sm:justify-start items-center gap-2 hover:text-white cursor-pointer transition-colors duration-200">
                <FaYoutube className="text-lg" />
                <Link href={socialLinks.youtube} target="_blank">YouTube</Link>
              </li>
            )}
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-gray-400 text-xs tracking-widest mb-4">EXPLORE</h4>
          <ul className="space-y-2">
            <Link href="/aboutus"><li className="hover:text-gray-300 cursor-pointer transition-colors duration-200">About Us</li></Link>
            <Link href="/gallery"><li className="hover:text-gray-300 cursor-pointer transition-colors duration-200 mt-3">Gallery</li></Link>
            <Link href="/whatsnew"><li className="hover:text-gray-300 cursor-pointer transition-colors duration-200 mt-3">Whats New</li></Link>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-gray-400 text-xs tracking-widest mb-4">CONTACT INFO</h4>
          <ul className="space-y-2">
           {contactInfo.address && (
              <li className="hover:text-gray-300 cursor-pointer transition-colors duration-200">
                {contactInfo.address} <br />
                {contactInfo.googleMapLink && (
                  <Link href={contactInfo.googleMapLink} target="_blank" className="underline hover:text-blue-300 text-xs">
                    Google Map
                  </Link>
                )}
              </li>
            )}
             {contactInfo.email && (
              <li className="hover:text-gray-300 cursor-pointer transition-colors duration-200">
                {contactInfo.email}
              </li>
            )}
            {contactInfo.salesPhone && (
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 text-white leading-none">
                <span className="text-[14px] font-light">SALES:</span>
                <span className="font-serif text-xl md:text-3xl font-semibold text-[#c78436]">{contactInfo.salesPhone}</span>
              </li>
            )}
           {contactInfo.frontOfficePhone && (
              <li className="flex flex-col sm:flex-row sm:items-center gap-1 text-white leading-none">
                <span className="text-[14px] font-light tracking-[0.5px]">FRONT OFFICE:</span>
                <span className="font-serif text-xl md:text-3xl font-semibold text-[#c78436]">{contactInfo.frontOfficePhone}</span>
              </li>
            )}
          </ul>
        </div>

      </div>

      {/* Privacy & Legal */}
      <div className="w-full max-w-7xl mx-auto border-t border-[#c78436] mt-8 mb-4"></div>

      <div className="flex w-full max-w-7xl mx-auto md:flex-row flex-col ">
        <div className="w-full max-w-7xl mx-auto mt-2 text-gray-400 text-xs text-center sm:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-wrap">
        <span>Privacy Policy</span>
        <span>Ad & Cookie Policy</span>
        <span>Legal Notices</span>
      </div>

      {/* Bottom Legal */}
      <div className="w-full max-w-7xl mx-auto mt-3 text-gray-400  text-xs text-center">
        © 2025 Nascent Gardenia Baridhara - All Rights Reserved
      </div>
      <div className="w-full max-w-7xl mx-auto mt-2 text-gray-400 text-sm text-center">
        Designed & Developed by <span className="font-semibold text-[#c78436]"><Link href="https://quicktech-ltd.com/">QuickTech IT</Link></span>
      </div>
      </div>
    </footer>
  );
}
