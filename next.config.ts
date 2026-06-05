import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats; AVIF is ~20-30% smaller than WebP for photos
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
