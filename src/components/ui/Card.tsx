"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export type MediaConfig = {
  /** Image URL */
  src: string;
  /** Alt text (defaults to title) */
  alt?: string;
  /** Tailwind aspect ratio class (e.g. 'aspect-video', 'aspect-square') */
  aspectClass?: string;
  /** Object fit mode for the image */
  fit?: "cover" | "contain";
};

export type MediaCardLinkProps = {
  href: string;
  title: string;
  description?: string;

  /** Legacy image props (still supported) */
  imageSrc?: string;
  imageAlt?: string;

  /** New structured media prop (preferred) */
  media?: MediaConfig;

  /**
   * Portion of horizontal space used by the thumbnail when present.
   * Example: 0.25 = 25% (default). Valid range (0, 1).
   */
  mediaFraction?: number;

  /** Right-side adornment (e.g., chevron) */
  trailing?: ReactNode;

  className?: string;
};

export default function MediaCardLink({
  href,
  title,
  description,
  imageSrc,
  imageAlt,
  media,
  mediaFraction,
  trailing,
  className = "",
}: MediaCardLinkProps) {
  const thumbSrc = media?.src ?? imageSrc;
  const thumbAlt = media?.alt ?? imageAlt ?? title;
  const aspect = media?.aspectClass ?? "aspect-video";
  const fitClass = media?.fit === "contain" ? "object-contain" : "object-cover";

  // Compute flex-basis from mediaFraction (fallback to 25%)
  const basisPercent =
    typeof mediaFraction === "number" && mediaFraction > 0 && mediaFraction < 1
      ? Math.round(mediaFraction * 100)
      : 25;

  return (
    <Link
      href={href}
      className={[
        "group flex gap-3 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:ring-black/10",
        className,
      ].join(" ")}
    >
      {/* Optional thumbnail */}
      {thumbSrc ? (
        <div
          className={[
            "relative shrink-0 overflow-hidden rounded-l-lg bg-slate-200 ring-1 ring-black/5",
            aspect,
          ].join(" ")}
          style={{ flexBasis: `${basisPercent}%` }}
        >
          <Image
            src={thumbSrc}
            alt={thumbAlt}
            fill
            sizes="(max-width: 640px) 25vw, 160px"
            className={fitClass}
            priority={false}
          />
        </div>
      ) : null}

      {/* Text column */}
      <div className="min-w-0 flex-1 py-2 pr-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          {trailing ?? null}
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
