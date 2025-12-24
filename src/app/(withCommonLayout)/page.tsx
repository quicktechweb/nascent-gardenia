"use client";

import { useState, useEffect } from "react";
import Banner from "../component/Banner/Banner";
import SocialMedia from "../component/SocialMedia/SocialMedia";
import NearbyPlace from "../component/NearbyPlace/NearbyPlace";
import SpecialOffer from "../component/SpecialOffer/SpecialOffer";
import LocationPage from "../component/Location/Location";
import RestaurantsPage from "../component/Resturant/Resturant";
import GymSection from "../component/GymSection/GymSection";
import RoomSection from "../component/RoomSection/RoomSection";
import Offersdata from "../component/Offer/Offerdata";
import ReservationSystem from "../component/Modal/ReservationsButton";

const HomePage = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      <Banner />
      <Offersdata />
      <RoomSection />
      <GymSection />
      <RestaurantsPage />
      {/* <NearbyPlace /> */}
      <SocialMedia />
      <SpecialOffer />
      <LocationPage />

      {/* ---------- Show Reservations Button after scroll ---------- */}
      {showButton && <ReservationSystem />}
    </div>
  );
};

export default HomePage;
