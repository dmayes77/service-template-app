// src/components/app/HeaderBar.tsx
"use client";

import {
  usePathname,
  useRouter,
  useSelectedLayoutSegments,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";

type Props = {
  /** Optional override. On "/" we usually show the brand name. */
  title?: string;
  homeTitle?: string; // e.g., "The Urban Shave"
};

const ROUTE_LABELS: Record<string, string> = {
  services: "Services",
  schedule: "Schedule",
  packages: "Packages",
  gallery: "Gallery",
  about: "About",
  policies: "Policies",
  contact: "Contact",
  faq: "FAQ",
};

const toFriendly = (seg: string) =>
  ROUTE_LABELS[seg] ??
  seg.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export default function HeaderBar({ title, homeTitle = "Welcome to MAD Tintz" }: Props) {
  const pathname = usePathname() || "/";
  const segments = useSelectedLayoutSegments(); // changes with navigation
  const router = useRouter();

  // compute the page label from the deepest segment
  const derived = useMemo(() => {
    if (pathname === "/") return homeTitle;
    const last = segments[segments.length - 1] ?? "";
    return toFriendly(last || "App");
  }, [pathname, segments, homeTitle]);

  // if a title prop is passed, it wins; otherwise use derived
  const [computedTitle, setComputedTitle] = useState(title ?? derived);
  useEffect(() => {
    setComputedTitle(title ?? derived);
  }, [title, derived]);

  const showBack = pathname !== "/";
  const onBack = () => {
    if (history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 bg-black text-white"
      style={{ paddingTop: "env(safe-area-inset-top)" }} // iOS notch padding
    >
      {/* relative container so the title can be absolutely centered */}
      <div className="relative mx-auto flex h-12 max-w-[640px] items-center px-2">
        {/* Left: back button (or spacer) */}
        {showBack ? (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="mr-1 grid h-10 w-10 place-items-center -ml-1 rounded-xl transition hover:bg-white/10 active:bg-white/15"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          <span className="mr-1 block h-10 w-10" aria-hidden />
        )}

        {/* Center: title — gets most of the width, stays centered */}
        <h1
          key={pathname} // ensure re-render on every route change
          className="pointer-events-none absolute left-1/2 top-1/2 w-[calc(100%-6rem)] -translate-x-1/2 -translate-y-1/2 px-2 text-center text-[17px] font-semibold leading-none tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis"
          aria-live="polite"
        >
          {computedTitle}
        </h1>

        {/* Right spacer (room for future actions) */}
        <span className="ml-auto block h-10 w-10" aria-hidden />
      </div>
    </header>
  );
}
