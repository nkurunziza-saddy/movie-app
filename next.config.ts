import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "allmoviesapp.95ede7f368d0be0851caf5425390876e.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typedRoutes: true,
};

export default nextConfig;