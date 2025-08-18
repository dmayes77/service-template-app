// src/components/app/BottomTabBar.tsx
"use client";
import { JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CarFront, Calendar, MoreHorizontal } from "lucide-react";
import { useMoreDrawer } from "@/components/more/MoreDrawerProvider";

type Tab = {
  href: string;
  label: string;
  match: "prefix" | "exact";
  Icon: (props: { className?: string }) => JSX.Element;
};

const TABS: Tab[] = [
  {
    href: "/",
    label: "Home",
    match: "exact",
    Icon: (p) => <Home className={`h-6 w-6 ${p.className ?? ""}`} />,
  },
  {
    href: "/services",
    label: "Services",
    match: "prefix",
    Icon: (p) => <CarFront className={`h-6 w-6 ${p.className ?? ""}`} />,
  },
  {
    href: "/schedule",
    label: "Schedule",
    match: "prefix",
    Icon: (p) => <Calendar className={`h-6 w-6 ${p.className ?? ""}`} />,
  },
];

export default function BottomTabBar() {
  const pathname = usePathname() || "/";
  const { open, isOpen } = useMoreDrawer();

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black pt-4"
      // Paint the iOS home-indicator area with the same background
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Bottom tabs"
    >
      <nav className="mx-auto max-w-[640px]">
        {/* Fixed height for layout; inner items fill it */}
        <ul className="grid h-16 grid-flow-col auto-cols-fr content-center gap-1 px-3">
          {TABS.map(({ href, label, match, Icon }) => {
            const active =
              match === "exact" ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href} className="h-full">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex h-full flex-col items-center justify-center gap-1 rounded-xl",
                    active ? "text-[color:var(--tint)]" : "text-white/80",
                    "active:bg-white/10",
                  ].join(" ")}
                >
                  <Icon />
                  <span className="text-[11px] font-semibold tracking-[-0.01em]">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* More button opens the drawer */}
          <li key="__more" className="h-full">
            <button
              type="button"
              onClick={open}
              aria-expanded={isOpen}
              aria-controls="more-drawer"
              className={[
                "flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl",
                isOpen ? "text-[color:var(--tint)]" : "text-white/80",
                "active:bg-white/10",
              ].join(" ")}
            >
              <MoreHorizontal className="h-6 w-6" />
              <span className="text-[11px] font-semibold tracking-[-0.01em]">
                More
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
