"use client";
import { useMemo, useState } from "react";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const placeholder = useMemo(() => "you@example.com", []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setError("Please enter your email.");
      setSuccess("");
      return;
    }

    if (!emailPattern.test(value)) {
      setError("Enter a valid email address.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("You are on the list. We will notify you soon.");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (error) setError("");
    if (success) setSuccess("");
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
              inputMode="email"
              placeholder={placeholder}
              value={email}
              onChange={handleChange}
              className="cs2-input"
              aria-invalid={Boolean(error)}
              aria-describedby="form-status"
            />
            <button type="submit" className="cs2-button">Notify Me</button>
          </form>

          <div id="form-status" className="cs2-status">
            {error && <p className="cs2-message cs2-message--error">{error}</p>}
            {success && <p className="cs2-message cs2-message--success">{success}</p>}
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
