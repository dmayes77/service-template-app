"use client";
import type { CSSProperties } from "react";
type Edge = "top" | "bottom" | "left" | "right";
const v = {
  top: "var(--sat, var(--satl, 0px))",
  bottom: "var(--sab, var(--sabl, 0px))",
  left: "var(--sal, var(--sall, 0px))",
  right: "var(--sar, var(--sarl, 0px))",
} as const;

export default function SafeAreaSpacer({ edge = "bottom" }: { edge?: Edge }) {
  const style: CSSProperties =
    edge === "top"
      ? { height: v.top }
      : edge === "bottom"
        ? { height: v.bottom }
        : edge === "left"
          ? { width: v.left }
          : { width: v.right };
  return <div style={style} aria-hidden="true" />;
}
