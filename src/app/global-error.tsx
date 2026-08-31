"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CodeConnect root layout error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#05060d",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main
          role="alert"
          style={{
            display: "grid",
            placeItems: "center",
            minHeight: "100vh",
            padding: 24,
            textAlign: "center",
          }}
        >
          <section style={{ maxWidth: 520 }}>
            <h1>Something went wrong</h1>
            <p>
              CodeConnect encountered a temporary problem. Your information is
              safe, and you can try again.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 24,
              }}
            >
              <button
                type="button"
                onClick={reset}
                style={{
                  border: 0,
                  borderRadius: 999,
                  padding: "10px 16px",
                  background: "#4fc1ff",
                  color: "#05060d",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Try again
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                style={{
                  border: "1px solid #ffffff",
                  borderRadius: 999,
                  padding: "10px 16px",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Return home
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
