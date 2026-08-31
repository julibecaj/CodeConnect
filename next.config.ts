import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/CS",
        destination: "/coming-soon",
        permanent: true,
      },
      {
        source: "/ForgPassw",
        destination: "/forgot-password",
        permanent: true,
      },
      {
        source: "/Main",
        destination: "/feed",
        permanent: true,
      },
      {
        source: "/User",
        destination: "/profile",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
