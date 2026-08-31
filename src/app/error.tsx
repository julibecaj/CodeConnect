"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CodeConnect route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main
      className="cc-bg"
      role="alert"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "60vh",
        padding: 24,
        textAlign: "center",
      }}
    >
      <section className="cc-cardv2" style={{ maxWidth: 520 }}>
        <h1 className="cc-section__title">Something went wrong</h1>
        <p className="cc-section__desc" style={{ marginTop: 8 }}>
          We could not load this page. Please try again.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 20,
          }}
        >
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="cc-pillbtn" href="/">
            Return home
          </a>
        </div>
      </section>
    </main>
  );
}
