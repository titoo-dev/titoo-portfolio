import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 25 is used for the intentionally low-res pixelated avatar
    qualities: [25, 75],
  },
};

export default nextConfig;
