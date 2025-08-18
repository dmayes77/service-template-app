// next.config.ts
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  register: true,
  cacheOnNavigation: true,
  reloadOnOnline: false,
  // Disable SW in dev (Turbopack)
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**", // required so TS treats this as a RemotePattern
      },
    ],
    // Alternative (simpler): domains: ["cdn.sanity.io"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: 'payment=(self "https://orbisx.ca" "https://www.orbisx.ca")',
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
