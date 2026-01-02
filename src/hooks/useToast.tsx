"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { ToastContainer } from "../components/ui/Toast";

type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextValue = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const duration = toast.duration ?? 4200;
      setToasts((prev) => [...prev, { ...toast, id }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast],
  );

  const clearToasts = useCallback(() => setToasts([]), []);

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      clearToasts,
    }),
    [addToast, removeToast, clearToasts, toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
