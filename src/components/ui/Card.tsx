// src/components/ui/MediaCardLink.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Media = {
  src: string;
  alt: string;
  /** Tailwind ratio class (e.g. "aspect-video", "aspect-square"). Default: aspect-video */
  aspectClass?: string;
  /** Object-fit for the <Image/>. Default: "cover" */
  fit?: "cover" | "contain";
};

type MediaCardLinkProps = {
  href: string;
  title: string;
  description?: string;
  /** Optional media block on the left */
  media?: Media;
  /** Replace the chevron on the right if desired */
  rightIcon?: ReactNode;
  className?: string;
  /** Left media width as a fraction of the card (0.2–0.5). Default: 0.25 (25%) */
  mediaFraction?: number;
  /** Forwarded to <Image sizes> */
  sizes?: string;
  /** Forwarded to <Link prefetch> */
  prefetch?: ComponentProps<typeof Link>["prefetch"];
};

export default function MediaCardLink({
  href,
  title,
  description,
  media,
  rightIcon,
  className = "",
  mediaFraction = 0.25,
  sizes = "(max-width: 640px) 25vw, 160px",
  prefetch,
}: MediaCardLinkProps) {
  const leftPct = Math.min(Math.max(mediaFraction, 0.2), 0.5) * 100;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label={title}
      className={[
        "group flex w-full gap-3 rounded-2xl bg-white shadow-sm",
        "ring-1 ring-black/5 transition hover:shadow-md hover:ring-black/10",
        className,
      ].join(" ")}
    >
      {/* Media (optional) */}
      {media ? (
        <div
          className="relative shrink-0 overflow-hidden rounded-l-xl bg-slate-200 ring-1 ring-black/5"
          style={{ width: `${leftPct}%` }}
        >
          <div className={media.aspectClass ?? "aspect-video"} />
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            className={
              media.fit === "contain" ? "object-contain" : "object-cover"
            }
            priority={false}
          />
        </div>
      ) : null}

      {/* Copy */}
      <div className="min-w-0 flex-1 py-2 pr-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <span className="mt-1 grid place-items-center text-slate-400 transition group-hover:text-slate-600">
            {rightIcon ?? <ChevronRight className="h-5 w-5" />}
          </span>
        </div>
        {description ? (
          <p className="mt-1 text-sm text-slate-700/90 line-clamp-3">
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
