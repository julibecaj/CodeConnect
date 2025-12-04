"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      const data = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !data?.success) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list! We'll email you when we launch.");
      setEmail("");
    } catch (error) {
      console.error("Notify submit error:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="cs2-bg">
      <div className="cs2-card">
        <section className="cs2-left">
          <span className="cs2-pill">Coming soon</span>
          <h1 className="cs2-title cs2-animate-up">CodeConnect</h1>
          <p className="cs2-subtitle cs2-animate-up cs2-animate-delay">
            We are building something amazing for developers to connect, collaborate, and launch together. Stay tuned!
          </p>

          <form className="cs2-form" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="cs2-input"
              aria-invalid={status === "error"}
              aria-describedby="form-status"
            />
            <button type="submit" className="cs2-button" disabled={status === "loading"}>
              {status === "loading" ? "Sending..." : "Notify Me"}
            </button>
          </form>

          <div id="form-status" className="cs2-status">
            {message && (
              <p
                className={`cs2-message ${
                  status === "success"
                    ? "cs2-message--success"
                    : status === "error"
                      ? "cs2-message--error"
                      : ""
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </section>

        <section className="cs2-right" aria-label="Characters working illustration">
          <div className="cs2-scene">
            <div className="cs2-platform" />

            <div className="cs2-character cs2-character--lead">
              <div className="cs2-head" />
              <div className="cs2-body" />
              <div className="cs2-laptop" />
            </div>

            <div className="cs2-character cs2-character--pair">
              <div className="cs2-head" />
              <div className="cs2-body" />
              <div className="cs2-laptop" />
            </div>

            <div className="cs2-character cs2-character--review">
              <div className="cs2-head" />
              <div className="cs2-body" />
              <div className="cs2-clipboard" />
            </div>

            <span className="cs2-gear cs2-gear--one" aria-hidden="true" />
            <span className="cs2-gear cs2-gear--two" aria-hidden="true" />
            <span className="cs2-gear cs2-gear--three" aria-hidden="true" />
          </div>
        </section>
      </div>
    </main>
  );
}
