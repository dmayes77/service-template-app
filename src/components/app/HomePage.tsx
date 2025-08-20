// src/components/app/HomePage.tsx
import Link from "next/link";
import Image from "next/image";
import type { JSX } from "react";
import { clientSafe as client } from "@/sanity/lib/client"; // 👈 tenant-aware + tolerant
import { homePageQuery } from "@/sanity/queries/homePageQuery";
import { appSettingsQuery } from "@/sanity/queries/appSettingsQuery";
import { CalendarCheck, Package, Images, ChevronRight } from "lucide-react";

export const revalidate = 0;

// --- types from your Sanity data ----------------------------------------
type IconKey = "calendar-check" | "package" | "images";

type QuickLink = {
  label: string;
  href: string;
  icon?: IconKey;
};

type HomeData = {
  logoUrl?: string;
  bgUrl?: string;
  quickLinks?: QuickLink[];
};

type AppSettings = {
  brandName?: string;
  themeTint?: string;
  logoUrl?: string;
  splash?: {
    useVideo?: boolean;
    bgImageUrl?: string;
    posterUrl?: string;
    webmUrl?: string;
    mp4Url?: string;
  };
};

// --- icon map ------------------------------------------------------------
const ICONS: Record<IconKey, (p: { className?: string }) => JSX.Element> = {
  "calendar-check": (p) => (
    <CalendarCheck className={`h-6 w-6 ${p.className ?? ""}`} />
  ),
  package: (p) => <Package className={`h-6 w-6 ${p.className ?? ""}`} />,
  images: (p) => <Images className={`h-6 w-6 ${p.className ?? ""}`} />,
};

// --- page ---------------------------------------------------------------
export default async function HomePage() {
  // Both fetches may return null if this tenant hasn't configured Sanity yet.
  const [home, settings] = await Promise.all([
    client.fetch<HomeData>(homePageQuery),
    client.fetch<AppSettings>(appSettingsQuery),
  ]);

  const brandName = settings?.brandName ?? "App";
  const themeTint = settings?.themeTint ?? undefined;

  // Prefer home.logoUrl, then settings.logoUrl
  const logoUrl = home?.logoUrl || settings?.logoUrl || undefined;

  // Decide background (video > image)
  const useVideo = !!(
    settings?.splash?.useVideo &&
    (settings.splash.webmUrl || settings.splash.mp4Url)
  );
  const posterUrl = settings?.splash?.posterUrl || undefined;
  const webmUrl = settings?.splash?.webmUrl || undefined;
  const mp4Url = settings?.splash?.mp4Url || undefined;

  const bgImage =
    (!useVideo && (home?.bgUrl || settings?.splash?.bgImageUrl)) || undefined;

  const defaults: QuickLink[] = [
    { label: "Book Now", href: "/schedule", icon: "calendar-check" },
    { label: "Packages", href: "/packages", icon: "package" },
    { label: "Gallery", href: "/gallery", icon: "images" },
  ];

  const quick: QuickLink[] =
    (Array.isArray(home?.quickLinks) && home.quickLinks.slice(0, 3)) ||
    defaults;

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background layer */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {useVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl}
          >
            {webmUrl ? <source src={webmUrl} type="video/webm" /> : null}
            {mp4Url ? <source src={mp4Url} type="video/mp4" /> : null}
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: bgImage ? `url(${bgImage})` : "none",
              backgroundColor: bgImage ? undefined : "#111",
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: themeTint ? `${themeTint}66` : "rgba(0,0,0,0.45)",
          }}
        />
      </div>

      {/* Centered stack */}
      <div className="relative z-10 mx-auto mt-4 grid max-w-md place-items-center px-5">
        <div className="w-full">
          <div className="grid place-items-center">
            <div className="relative grid aspect-square w-[min(78vw,420px)] place-items-center rounded-full">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  fill
                  sizes="(max-width: 420px) 78vw, 420px"
                  className="object-contain"
                  priority
                />
              ) : null}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {quick.map((q, i) => {
              const iconKey: IconKey = q.icon ?? "calendar-check";
              const Icon = ICONS[iconKey];
              return (
                <Link
                  key={`${q.href}-${i}`}
                  href={q.href}
                  className="block rounded-xl bg-black/50 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-black"
                >
                  <div className="flex items-center justify-between px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                        <Icon />
                      </div>
                      <span className="text-xl font-semibold">{q.label}</span>
                    </div>
                    <ChevronRight className="h-6 w-6 text-white/70" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Optional brand footer */}
          <p className="mt-6 text-center text-white/70 text-sm">{brandName}</p>
        </div>
      </div>
    </div>
  );
}
