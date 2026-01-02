"use client";

import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className="cc-tag"
      style={tone === "muted" ? { background: "rgba(255,255,255,.04)", borderColor: "rgba(255,255,255,.08)" } : undefined}
    >
      <span className="cc-dot" />
      {children}
    </span>
  );
}
