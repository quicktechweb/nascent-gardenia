import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: 'export',  
  images: {
    unoptimized: true, // ✅ Add this line
    domains: [
      "media.istockphoto.com",
      "images.freeimages.com",
      "i.ibb.co",
      "img.freepik.com",
      "pngimg.com",
      "encrypted-tbn0.gstatic.com",
    ],
  },

   eslint: {
    ignoreDuringBuilds: true, // ✅ ignore ESLint warnings during build
  },
  typescript: {
    ignoreBuildErrors: true,   // ✅ ignore TypeScript warnings/errors during build
  },
};

export default nextConfig;
