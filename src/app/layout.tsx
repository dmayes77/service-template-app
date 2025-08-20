import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import SafeAreaGlobals from "@/components/safe-area/SafeAreaGlobals";
import { loadTenant } from "@/lib/tenant";
import { headers as getHeaders } from "next/headers";

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
  const tenant = await loadTenant();
  const b = tenant.branding;
  const css = `
    :root {
      --brand-primary: ${b.primary};
      --brand-accent:  ${b.accent};
      --brand-text:    ${b.text};
    }
  `;

  // Allow admin & debug pages even if tenant is inactive
  const h = await getHeaders();
  const pathname = h.get("x-pathname") ?? "/";
  const bypassGate =
    pathname.startsWith("/tenant-admin") ||
    pathname.startsWith("/debug") ||
    pathname.startsWith("/sanity-test");

  const inactive = tenant.status && tenant.status !== "active";

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <SafeAreaGlobals />
        {inactive && !bypassGate ? (
          <main className="mx-auto max-w-xl p-8">
            <h1 className="text-2xl font-semibold">Account needs attention</h1>
            <p className="mt-3 text-sm">
              Status: <strong>{tenant.status}</strong>. Please update billing or
              contact support.
            </p>
            <a
              className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
              href="/tenant-admin"
            >
              Manage Tenant
            </a>
          </main>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
