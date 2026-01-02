"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export default function SignupForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Signup failed");
      router.push("/login?from=signup");
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <p className="cc-formhint" style={{ marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="cc-field">
          <label htmlFor="name">Full name</label>
          <input
            className="cc-input"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </div>

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
            autoComplete="new-password"
            required
          />
        </div>

        <div className="cc-field">
          <label htmlFor="confirm">Confirm password</label>
          <input
            className="cc-input"
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="cc-auth__actions">
          <label>
            <input type="checkbox" name="terms" required /> I agree to the Terms and Privacy.
          </label>
          <Link className="cc-auth__link" href="#community">
            Community guidelines
          </Link>
        </div>

        <button className="cc-btn cc-btn--solid cc-auth__submit" type="submit">
          {submitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="cc-auth__hint">
        Already have an account?{" "}
        <Link className="cc-auth__link" href="/login">
          Log in instead
        </Link>
      </p>
    </>
  );
}
