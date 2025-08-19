// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import SafeAreaGlobals  from "@/components/safe-area/SafeAreaGlobals";

export const metadata: Metadata = {
  title: {
    default: "Service Template App",
    template: "%s | Service Template App",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // ← IMPORTANT
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SafeAreaGlobals /> {/* exposes CSS vars for safe areas */}
        {children}
      </body>
    </html>
  );
}
