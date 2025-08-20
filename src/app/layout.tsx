// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import SafeAreaGlobals from "@/components/safe-area/SafeAreaGlobals";
import { loadTenant } from "@/lib/tenant"; // ← NEW

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
  viewportFit: "cover",
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await loadTenant(); // ← NEW
  const b = tenant.branding;
  const css = `
    :root {
      --brand-primary: ${b.primary};
      --brand-accent:  ${b.accent};
      --brand-text:    ${b.text};
    }
      body { color: var(--brand-text); }
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <style dangerouslySetInnerHTML={{ __html: css }} /> {/* ← NEW */}
        <SafeAreaGlobals />
        {children}
      </body>
    </html>
  );
}
