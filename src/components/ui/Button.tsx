"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "default" | "danger";
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = "default", loading, icon, children, className, disabled, ...props }: ButtonProps) {
  const classes = [
    "cc-pillbtn",
    variant === "primary" ? "cc-pillbtn--primary" : "",
    variant === "ghost" ? "cc-pillbtn--ghost" : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {icon && !loading && <span aria-hidden>{icon}</span>}
      {children}
      {variant === "danger" && (
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block", marginLeft: 6 }} />
      )}
    </button>
  );
}
