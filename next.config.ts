import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects(){
    return[
      {
        source: "/",
        destination: "/CS",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;


/*
Keeps your Coming Soon page in /CS exactly as it is.

When a user visits the root of your website (/), they are automatically redirected to /CS.

You don’t need to move or change any files inside src/app.
*/