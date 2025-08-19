// src/components/app/HomePage.tsx
import Link from "next/link";
import Image from "next/image";
import type { JSX } from "react";
import { client } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/queries/homePageQuery";
import { appSettingsQuery } from "@/sanity/queries/appSettingsQuery";
import { CalendarCheck, Package, Images, ChevronRight } from "lucide-react";

export const revalidate = 0;

// --- types --------------------------------------------------------------
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

type SettingsLite = {
  brandName?: string;
};

// --- icon map -----------------------------------------------------------
const ICONS: Record<IconKey, (p: { className?: string }) => JSX.Element> = {
  "calendar-check": (p) => (
    <CalendarCheck className={`h-6 w-6 ${p.className ?? ""}`} />
  ),
  package: (p) => <Package className={`h-6 w-6 ${p.className ?? ""}`} />,
  images: (p) => <Images className={`h-6 w-6 ${p.className ?? ""}`} />,
};

// --- page ---------------------------------------------------------------
export default async function HomePage() {
  const [home, settings] = await Promise.all([
    client.fetch<HomeData>(homePageQuery),
    client.fetch<SettingsLite>(appSettingsQuery),
  ]);

  const bgUrl = home?.bgUrl;

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
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : "none",
            backgroundColor: bgUrl ? undefined : "#111",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Centered stack */}
      <div className="relative z-10 mx-auto mt-4 grid max-w-md place-items-center px-5">
        <div className="w-full">
          <div className="grid place-items-center">
            <div className="relative grid aspect-square w-[min(78vw,420px)] place-items-center rounded-full">
              {home.logoUrl ? (
                <Image
                  src={home.logoUrl}
                  alt={settings.brandName || "Logo"}
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
        </div>
      </div>
    </div>
  );
}
