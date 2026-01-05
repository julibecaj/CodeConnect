import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/CS",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;



/**... */
