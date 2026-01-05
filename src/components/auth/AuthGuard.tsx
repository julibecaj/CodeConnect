"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../ui/Spinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const next = useMemo(() => {
    const base = pathname || "/";
    const query = searchParams.toString();
    return query ? `${base}?${query}` : base;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?from=protected&next=${encodeURIComponent(next)}`);
    }
  }, [status, router, next]);

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
