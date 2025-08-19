"use client";

import Image from "next/image";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useEffect, useState } from "react";

function IOSShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 16V4m0 0 3 3m-3-3-3 3" strokeWidth="2" />
      <rect x="4" y="10" width="16" height="10" rx="2" strokeWidth="2" />
    </svg>
  );
}
function AndroidMenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

type Source = { src: string; type: string };

export default function InstallGate({
  brand = "Your App",
  // background media
  bgImage = "/brand/bg.jpg",
  videoSources = [] as Source[],
  videoPoster = "/brand/bg.jpg",
  // logo
  logoSrc = "/brand/logo.png",
}: {
  brand?: string;
  bgImage?: string;
  videoSources?: Source[];
  videoPoster?: string;
  logoSrc?: string;
}) {
  const { installed, canInstall, promptInstall, platform } = usePWAInstall();
  const [busy, setBusy] = useState(false);

  // Respect user prefs: reduced-motion & save-data → use image
  const [allowVideo, setAllowVideo] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = m.matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData === true;
    setAllowVideo(!reduced && !saveData);
    const onChange = () => setAllowVideo(!m.matches && !saveData);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  if (process.env.NEXT_PUBLIC_INSTALL_GATE_BYPASS === "1") return null;
  if (installed) return null;

  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isDesktop = platform === "desktop";
  const showInstallButton = !isIOS && canInstall;

  const onInstall = async () => {
    setBusy(true);
    try {
      await promptInstall();
    } finally {
      setBusy(false);
    }
  };

  const showVideo = allowVideo && videoSources.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Install required"
      className="fixed inset-0 z-[90] grid place-items-center bg-black"
    >
      {/* Background image (Next/Image) when video is not used */}
      {!showVideo && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src={bgImage}
            alt="" // decorative
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Background video (when allowed & provided) */}
      {showVideo && (
        <video
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={videoPoster}
          aria-hidden="true"
        >
          {videoSources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}

      {/* Darken overlay for legibility */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      {/* Content */}
      <div className="relative mx-4 w-full max-w-[560px] px-4">
        {/* Logo puck */}
        <div className="mx-auto grid aspect-square w-[min(78vw,420px)] place-items-center rounded-full">
          <div className="relative h-full w-full">
            <Image
              src={logoSrc}
              alt={`${brand} logo`}
              fill
              priority
              sizes="(max-width: 560px) 78vw, 420px"
              className="object-contain"
            />
          </div>
        </div>

        {/* Card */}
        <div className="mt-6 rounded-2xl bg-white/95 p-5 text-center shadow-xl backdrop-blur">
          <h1 className="text-lg font-semibold text-gray-900">
            Install {brand} App
          </h1>
          <p className="mt-1 text-gray-700">
            Install to your device for the best experience.
          </p>

          {showInstallButton && (
            <button
              onClick={onInstall}
              disabled={busy}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-[color:var(--tint)] px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Requesting…" : "Install App"}
            </button>
          )}

          {/* iOS-only instructions */}
          {isIOS && (
            <div className="mt-4 space-y-3 rounded-xl bg-gray-50 p-4 text-left text-gray-800">
              <div className="flex items-center gap-3">
                <IOSShareIcon className="h-6 w-6" />
                <p className="font-medium">Tap the Share button</p>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="currentColor"
                >
                  <path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm3 1h4v2h-4V5Z" />
                </svg>
                <p className="font-medium">Choose “Add to Home Screen”</p>
              </div>
              <p className="text-sm text-gray-600">
                Open it from your Home Screen to continue.
              </p>
            </div>
          )}

          {/* Android fallback (when BIP didn't fire) */}
          {isAndroid && !canInstall && (
            <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-4 text-left text-gray-800">
              <div className="flex items-center gap-3">
                <AndroidMenuIcon className="h-6 w-6" />
                <p className="font-medium">Open the browser menu</p>
              </div>
              <p className="text-sm text-gray-700">
                Tap <strong>⋮</strong> then choose <strong>Install app</strong>{" "}
                (or <strong>Add to Home screen</strong>).
              </p>
              <p className="text-sm text-gray-600">
                Then launch it from your Home screen.
              </p>
            </div>
          )}

          {/* Desktop fallback */}
          {isDesktop && !canInstall && (
            <p className="mt-3 text-sm text-gray-600">
              Use your browser menu to install this site as an app (Chrome:{" "}
              <em>Install App</em>, Edge:{" "}
              <em>Apps → Install this site as an app</em>).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
