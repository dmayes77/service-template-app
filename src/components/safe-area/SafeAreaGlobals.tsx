// src/components/safe-area/SafeAreaGlobals.tsx
"use client";
import { createGlobalStyle } from "styled-components";

/**
 * Expose CSS variables that mirror the platform safe-area insets.
 * Works on modern Safari/Chrome PWAs; gracefully falls back to 0 elsewhere.
 */
export const SafeAreaGlobals = createGlobalStyle`
  :root{
    /* modern */
    --sat: env(safe-area-inset-top);
    --sab: env(safe-area-inset-bottom);
    --sal: env(safe-area-inset-left);
    --sar: env(safe-area-inset-right);
    /* legacy iOS 11 (harmless elsewhere) */
    --satl: constant(safe-area-inset-top);
    --sabl: constant(safe-area-inset-bottom);
    --sall: constant(safe-area-inset-left);
    --sarl: constant(safe-area-inset-right);
  }
`;
