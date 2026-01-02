"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ title, open, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="cc-modal"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 60,
        padding: 16,
      }}
    >
      <div
        className="cc-cardv2"
        style={{ maxWidth: 560, width: "100%", position: "relative" }}
      >
        <header className="cc-cardv2__head">
          <h3 className="cc-cardv2__title">{title}</h3>
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
        </header>
        <div className="cc-cardv2__body">{children}</div>
        {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
      </div>
    </div>
  );
}
