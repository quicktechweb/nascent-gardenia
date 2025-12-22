"use client";

import { useState, useEffect } from "react";
import Banner from "../component/Banner/Banner";
import SocialMedia from "../component/SocialMedia/SocialMedia";
import NearbyPlace from "../component/NearbyPlace/NearbyPlace";
import SpecialOffer from "../component/SpecialOffer/SpecialOffer";
import LocationPage from "../component/Location/Location";
import RestaurantsPage from "../component/Resturant/Resturant";
import ReservationsButton from "../component/Modal/ReservationsButton";
import ReservationModal from "../component/Modal/Modal";
import GymSection from "../component/GymSection/GymSection";
import RoomSection from "../component/RoomSection/RoomSection";
import Offersdata from "../component/Offer/Offerdata";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
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
    <>
      <div className="bg-white overflow-hidden">
        <Banner />
        <Offersdata />
        <RoomSection/>
        <GymSection/>
        <RestaurantsPage />
        
        {/* <NearbyPlace /> */}
        <SocialMedia />
        <SpecialOffer />
        <LocationPage />

        {/* Scroll এর পরে button দেখাবে */}
        {showButton && (
          <div className="fixed left-1/2 transform -translate-x-1/2 bottom-6 z-50">
            <ReservationsButton onClick={() => setShowModal(true)} />
          </div>
        )}

        <ReservationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </>
  );
};

export default HomePage;
