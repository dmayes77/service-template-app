// src/components/orbisx/BookingEmbed.client.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = { bookingId?: string; className?: string };

// precise shape of the postMessage payload we care about
type FrameHeightMessage = { frameHeight: number };

function isFrameHeightMessage(v: unknown): v is FrameHeightMessage {
  if (typeof v !== "object" || v === null) return false;
  const rec = v as Record<string, unknown>;
  return typeof rec.frameHeight === "number";
}

export default function BookingEmbed({
  bookingId = "VSnff",
  className = "",
}: Props) {
  const src = useMemo(
    () => `https://orbisx.ca/app/booknow/${bookingId}`,
    [bookingId]
  );
  const ORIGIN = useMemo(() => new URL(src).origin, [src]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // only accept messages from the iframe’s origin
      if (e.origin !== ORIGIN) return;
      if (isFrameHeightMessage(e.data)) {
        const next = Math.max(600, e.data.frameHeight + 30);
        setHeight(next);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [ORIGIN]);

  return (
    <div className={`block w-full ${className}`}>
      <iframe
        ref={iframeRef}
        id="OrbisXbookingForm"
        name="OrbisXbookingForm"
        title="Book Now"
        src={src}
        style={{ border: 0, width: "100%", height }}
        frameBorder={0}
        // ✅ Correct permissions-policy syntax for iframes (no inner quotes)
        allow="payment 'self' https://orbisx.ca https://www.orbisx.ca"
        allowFullScreen
      />
    </div>
  );
}
