"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: replace with real auth; after login send to profile/dashboard.
    router.push("/User");
  };

  return (
    <>
      {from === "signup" && (
        <p className="cc-formhint" style={{ marginBottom: "10px" }}>
          Account created. Log in to continue.
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
          Log In
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
