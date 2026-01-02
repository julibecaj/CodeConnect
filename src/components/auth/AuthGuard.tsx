"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../ui/Spinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?from=protected");
    }
  }, [status, router]);

  if (status === "loading" || status === "idle") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <Spinner size={32} />
        <p className="cc-formhint">Checking your session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <p className="cc-formhint">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
