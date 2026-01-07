"use client";

import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "default" | "muted";
};

export function Card({ title, action, children, tone = "default" }: CardProps) {
  return (
    <div className={`cc-cardv2 ${tone === "muted" ? "is-muted" : ""}`}>
      {(title || action) && (
        <div className="cc-cardv2__head">
          {title && <h3 className="cc-cardv2__title">{title}</h3>}
          {action && <div className="cc-cardv2__action">{action}</div>}
        </div>
      )}
      <div className="cc-cardv2__body">{children}</div>
    </div>
  );
}
