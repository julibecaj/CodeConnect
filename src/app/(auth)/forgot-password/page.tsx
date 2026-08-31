"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/Input";
import { useToast } from "../../../hooks/useToast";
import { api } from "../../../lib/api";
import { validateEmail } from "../../../lib/validators";

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);
    setSuccess(null);
    if (emailError) return;

    setSubmitting(true);
    try {
      await api.forgotPassword({ email });
      setSuccess("Check your inbox for a reset link.");
      addToast({ type: "success", message: "Reset link sent." });
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send reset link.";
      setError(message);
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="cc-auth__grid">
          <div className="cc-auth__card">
            <h1 className="cc-auth__title">Reset your password</h1>
            <p className="cc-auth__lead">
              Enter the email you use for CodeConnect and we&apos;ll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="cc-formgrid">
              {error && <p className="cc-formhint" style={{ color: "#fca5a5" }}>{error}</p>}
              {success && <p className="cc-formhint" style={{ color: "#a5f3fc" }}>{success}</p>}
              <InputField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={error || undefined}
              />
              <Button className="cc-auth__submit" type="submit" variant="primary" loading={submitting}>
                Send reset link
              </Button>
            </form>

            <p className="cc-auth__hint">
              Remembered it?{" "}
              <Link className="cc-auth__link" href="/login">
                Back to login
              </Link>
            </p>
          </div>

          <div className="cc-auth__card">
            <h2 className="cc-auth__title">Stay secure</h2>
            <p className="cc-auth__lead">
              Use a strong password and turn on two-factor authentication from Settings once you&apos;re in.
            </p>
            <ul className="cc-footer__list">
              <li>Use at least 12 characters.</li>
              <li>Mix letters, numbers, and symbols.</li>
              <li>Never reuse passwords across sites.</li>
            </ul>
          </div>
    </section>
  );
}
