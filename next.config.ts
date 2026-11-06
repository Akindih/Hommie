import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (where licensed look images will live)
      { protocol: "https", hostname: "*.supabase.co" },
      // Placeholder images used by the seed data
      { protocol: "https", hostname: "placehold.co" },
    ],
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
