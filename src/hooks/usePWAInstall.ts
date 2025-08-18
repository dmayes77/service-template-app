"use client";
import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Navigator {
    /** iOS Safari when launched from A2HS */
    standalone?: boolean;
  }
}

type Platform = "ios" | "android" | "desktop" | "unknown";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mm =
    window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone = navigator.standalone === true;
  const twa = document.referrer?.startsWith("android-app://") ?? false;
  return mm || iosStandalone || twa;
}

function isIOSLike(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const isiOSUA = /iphone|ipad|ipod/.test(ua);
  // iPadOS 13+ can present as "Mac" but has touch points
  const isIPadOS =
    navigator.platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1;
  return isiOSUA || isIPadOS;
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  if (isIOSLike()) return "ios";
  if (/android/.test(ua)) return "android";
  if (/mac|win|linux|cros/.test(ua)) return "desktop";
  return "unknown";
}

export function usePWAInstall() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setInstalled(isStandalone());

    const onBip = (e: Event) => {
      const ev = e as BeforeInstallPromptEvent;
      ev.preventDefault();
      deferredRef.current = ev;
      setCanInstall(true);
    };

    const onInstalled = () => {
      deferredRef.current = null;
      setCanInstall(false);
      setInstalled(true);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") setInstalled(isStandalone());
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const platform = useMemo(() => detectPlatform(), []);

  const promptInstall = async () => {
    const ev = deferredRef.current;
    if (!ev) return { ok: false as const, reason: "not-available" as const };
    await ev.prompt();
    const choice = await ev.userChoice;
    if (choice.outcome === "accepted") {
      setTimeout(() => setInstalled(isStandalone()), 1200);
      return { ok: true as const };
    }
    return { ok: false as const, reason: "dismissed" as const };
  };

  return { installed, canInstall, promptInstall, platform };
}
