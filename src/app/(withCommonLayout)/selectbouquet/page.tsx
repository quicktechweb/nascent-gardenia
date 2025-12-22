"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

const RoomsPage = dynamic(() => import("./Roomspage"), {
  ssr: false,
});

export default function Page() {

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <RoomsPage />
    </Suspense>
  );
}
