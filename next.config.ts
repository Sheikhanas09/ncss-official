import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos uploaded from the admin panel are stored in Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
