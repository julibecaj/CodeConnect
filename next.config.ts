import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 async redirects() {
    return [
      {
        source: "/",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;



/**...
 *  source: "/",
        destination: "/CS",
        permanent: false,



    async redirects() {
    return [
      {
        source: "/",
        destination: "/",
        permanent: false,
      },
    ];
  },
 */
