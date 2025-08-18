// next.config.mjs
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  register: true,
  cacheOnNavigation: true,
  reloadOnOnline: false,
  // Disable SW in dev (Turbopack)
  disable: process.env.NODE_ENV !== "production",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Allow Payment Request API in our doc + the OrbisX embed
            key: "Permissions-Policy",
            value: 'payment=(self "https://orbisx.ca" "https://www.orbisx.ca")',
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
