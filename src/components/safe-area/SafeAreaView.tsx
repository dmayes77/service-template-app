"use client";
import type { CSSProperties, ReactNode } from "react";

type Edge = "top" | "bottom" | "left" | "right";
type Insets = Partial<Record<Edge, number>>;

const varMap: Record<Edge, string> = {
  top: "var(--sat, var(--satl, 0px))",
  bottom: "var(--sab, var(--sabl, 0px))",
  left: "var(--sal, var(--sall, 0px))",
  right: "var(--sar, var(--sarl, 0px))",
};
const add = (v: string, extra = 0) => (extra ? `calc(${v} + ${extra}px)` : v);

export default function SafeAreaView({
  children,
  className,
  style,
  edges = ["top", "bottom"],
  mode = "padding",
  inset,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  edges?: Edge[];
  mode?: "padding" | "margin";
  inset?: Insets | number;
}) {
  const extra: Insets =
    typeof inset === "number"
      ? { top: inset, bottom: inset, left: inset, right: inset }
      : inset || {};
  const s: CSSProperties = { ...style };

  edges.forEach((edge) => {
    const v = add(varMap[edge], extra[edge] ?? 0);
    if (mode === "padding") {
      if (edge === "top") s.paddingTop = v;
      if (edge === "bottom") s.paddingBottom = v;
      if (edge === "left") s.paddingLeft = v;
      if (edge === "right") s.paddingRight = v;
    } else {
      if (edge === "top") s.marginTop = v;
      if (edge === "bottom") s.marginBottom = v;
      if (edge === "left") s.marginLeft = v;
      if (edge === "right") s.marginRight = v;
    }
  });

  return (
    <div className={className} style={s}>
      {children}
    </div>
  );
}
