"use client";

import type { ReactNode } from "react";
import type { Toast } from "../../hooks/useToast";
import { Button } from "./Button";

type ToastContainerProps = {
  toasts: Toast[];
  onDismiss: (id: string) => void;
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts.length) return null;

  return (
    <div
      className="cc-toaststack"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 70,
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function toneColors(type?: Toast["type"]) {
  if (type === "success") return { border: "#22c55e", text: "#befae3" };
  if (type === "error") return { border: "#f97316", text: "#fed7aa" };
  return { border: "#4fc1ff", text: "#e0f2fe" };
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { border, text } = toneColors(toast.type);
  return (
    <div
      className="cc-cardv2"
      style={{
        minWidth: 280,
        maxWidth: 360,
        borderLeft: `4px solid ${border}`,
        color: text,
        boxShadow: "0 20px 40px rgba(0,0,0,.35)",
      }}
    >
      <div className="cc-cardv2__head">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {toast.title && <strong>{toast.title}</strong>}
          <span style={{ color: "inherit" }}>{toast.message}</span>
        </div>
        <Button variant="ghost" type="button" onClick={onDismiss} aria-label="Dismiss notification">
          ×
        </Button>
      </div>
    </div>
  );
}
