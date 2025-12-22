// File: src/app/(withCommonLayout)/selectbouquet/page.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// Client-only load of RoomsPage
const RoomsPage = dynamic(() => import("./RoomsPage"), { ssr: false });

export default function Page() {
  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RoomsPage />
    </Suspense>
  );
}
