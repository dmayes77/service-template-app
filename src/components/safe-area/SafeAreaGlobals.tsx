// src/components/safe-area/SafeAreaGlobals.tsx
"use client";

export default function SafeAreaGlobals() {
  return (
    <style jsx global>{`
      :root {
        --sa-top: env(safe-area-inset-top);
        --sa-right: env(safe-area-inset-right);
        --sa-bottom: env(safe-area-inset-bottom);
        --sa-left: env(safe-area-inset-left);
      }
    `}</style>
  );
}
