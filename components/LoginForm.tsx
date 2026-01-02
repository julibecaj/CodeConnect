"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Login failed");
      router.push("/User");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {from === "signup" && (
        <p className="cc-formhint" style={{ marginBottom: "10px" }}>
          Account created. Log in to continue.
        </p>
      )}

      {error && (
        <p className="cc-formhint" style={{ marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="cc-field">
          <label htmlFor="email">Email</label>
          <input
            className="cc-input"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="cc-field">
          <label htmlFor="password">Password</label>
          <input
            className="cc-input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="cc-auth__actions">
          <label>
            <input type="checkbox" name="remember" /> Remember me
          </label>
          <Link className="cc-auth__link" href="/ForgPassw">
            Forgot password?
          </Link>
        </div>

        <button className="cc-btn cc-btn--solid cc-auth__submit" type="submit">
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="cc-auth__hint">
        New to CodeConnect?{" "}
        <Link className="cc-auth__link" href="/signup">
          Create an account
        </Link>
      </p>
    </>
  );
}
