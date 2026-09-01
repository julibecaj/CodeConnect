"use client";

import type { ReactNode } from "react";
import { MotionProvider } from "../motion";
import { AuthProvider } from "../../hooks/useAuth";
import { ToastProvider } from "../../hooks/useToast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </MotionProvider>
  );
}
