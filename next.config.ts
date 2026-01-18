import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.fhan20-1.fna.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
