"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PropsWithChildren, ReactNode } from "react";

type Ctx = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};
const MoreDrawerContext = createContext<Ctx | null>(null);

export function useMoreDrawer() {
  const ctx = useContext(MoreDrawerContext);
  if (!ctx)
    throw new Error("useMoreDrawer must be used within MoreDrawerProvider");
  return ctx;
}

export default function MoreDrawerProvider({
  children,
  drawerContent,
  zIndex = 80,
}: PropsWithChildren<{ drawerContent?: ReactNode; zIndex?: number }>) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // ESC to close + body scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.documentElement.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const value = useMemo<Ctx>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle]
  );

  return (
    <MoreDrawerContext.Provider value={value}>
      {children}

      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        className={[
          "fixed inset-0 bg-black/40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        style={{ zIndex }}
        onClick={close}
      />

      {/* Sheet */}
      <div
        id="more-drawer" // ← matches aria-controls on the More button
        role="dialog"
        aria-modal="true"
        aria-label="More menu"
        className={[
          "fixed inset-x-0 bottom-0 w-full transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ zIndex: zIndex + 1 }}
      >
        <div className="mx-auto w-full max-w-[640px] rounded-t-2xl bg-white/95 backdrop-blur shadow-2xl">
          {/* drag handle */}
          <div className="flex justify-center pt-2 pb-1">
            <span className="h-1.5 w-12 rounded-full bg-gray-300" />
          </div>

          {/* content area — extra bottom padding */}
          <div className="px-4 pt-2 pb-8 md:pb-10">
            {drawerContent ?? (
              <div className="py-3 text-sm text-gray-600">
                <p className="mb-2 font-semibold text-gray-900">More</p>
                <p>We’ll add your real menu here later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MoreDrawerContext.Provider>
  );
}
