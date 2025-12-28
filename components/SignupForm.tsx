"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: replace with real sign-up request; redirect to login on success.
    router.push("/login?from=signup");
  };

  return (
    <>
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
          Sign Up
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
