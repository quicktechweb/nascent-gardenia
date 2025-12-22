"use client";

import { useState } from "react";
import Footer from "../component/Shared/Footer/Footer";
import Navbar from "../component/Shared/Navbar/Navbar";
import GoogleTranslate from "../component/GoogleTranslate/GoogleTranslate";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const [toggle, setToggle] = useState(false);

  const user = {
    photoURL: "", // or default user data
  };

  const userLogOut = () => {
    console.log("User logged out");
  };

  return (
    <>
     <GoogleTranslate />

      <Navbar
        user={user}
        toggle={toggle}
        setToggle={setToggle}
        userLogOut={userLogOut}
      />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
};



export default CommonLayout;
