import Link from "next/link";
import type { JSX } from "react";
import { client } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/queries";
import { CalendarCheck, Package, Images, ChevronRight } from "lucide-react";

type Quick = { label?: string; href?: string; icon?: string };
type HomeData = { logoUrl?: string; bgUrl?: string; quickLinks?: Quick[] };

export const revalidate = 0; // reflect Studio edits immediately in dev

const ICONS: Record<string, (p: { className?: string }) => JSX.Element> = {
  "calendar-check": (p) => (
    <CalendarCheck className={`h-6 w-6 ${p.className ?? ""}`} />
  ),
  package: (p) => <Package className={`h-6 w-6 ${p.className ?? ""}`} />,
  images: (p) => <Images className={`h-6 w-6 ${p.className ?? ""}`} />,
};

export default async function HomePage() {
  const data = await client.fetch<HomeData>(homePageQuery);

  const quick = data?.quickLinks?.slice(0, 3) ?? [
    { label: "Book Now", href: "/schedule", icon: "calendar-check" },
    { label: "Packages", href: "/packages", icon: "package" },
    { label: "Gallery", href: "/gallery", icon: "images" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: data?.bgUrl ? `url(${data.bgUrl})` : "none",
            backgroundColor: data?.bgUrl ? undefined : "#111",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Centered stack */}
      <div className="relative z-10 mx-auto grid max-w-md place-items-center px-5 mt-4">
        <div className="w-full">
          <div className="grid place-items-center">
            <div className="grid aspect-square w-[min(78vw,420px)] place-items-center rounded-full">
              {" "}
              {/* eslint-disable-next-line @next/next/no-img-element */}{" "}
              <img
                src={data?.logoUrl || ""}
                alt={"Logo"}
                className="object-contain"
              />{" "}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {quick.map((q, i) => {
              const Icon = (q.icon && ICONS[q.icon]) || ICONS["calendar-check"];
              return (
                <Link
                  key={`${q.href}-${i}`}
                  href={q.href ?? "#"}
                  className="block rounded-xl bg-black/50 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-black"
                >
                  <div className="flex items-center justify-between px-5 py-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                        <Icon />
                      </div>
                      <span className="text-xl font-semibold">
                        {q.label ?? "Action"}
                      </span>
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
