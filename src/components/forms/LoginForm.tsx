"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import type { ApiRequestError } from "../../lib/api";
import { validateEmail, validatePassword } from "../../lib/validators";
import { Button } from "../ui/Button";
import { InputField } from "../ui/Input";

type Errors = Partial<Record<"email" | "password", string>>;

export function LoginForm() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const successMessage = useMemo(() => {
    if (searchParams.get("from") === "signup") return "Account created. Log in to continue.";
    if (searchParams.get("from") === "protected") return "Please log in to continue.";
    return null;
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {
      email: validateEmail(email) || undefined,
      password: validatePassword(password) || undefined,
    };
    setErrors(nextErrors);
    setFormError(null);

    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await login({ email, password });
      addToast({ type: "success", message: "Logged in successfully" });
      const next = searchParams.get("next") || "/User";
      router.replace(next);
    } catch (err) {
      const message =
        (err as ApiRequestError)?.message || "Login failed. Please check your credentials.";
      setFormError(message);
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cc-formgrid">
      {successMessage && (
        <p className="cc-formhint" style={{ color: "#a5f3fc" }}>
          {successMessage}
        </p>
      )}
      {formError && (
        <p className="cc-formhint" style={{ color: "#fca5a5" }}>
          {formError}
        </p>
      )}

      <InputField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={errors.email}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={errors.password}
      />

      <div className="cc-auth__actions">
        <label>
          <input type="checkbox" name="remember" /> Remember me
        </label>
        <a className="cc-auth__link" href="/ForgPassw">
          Forgot password?
        </a>
      </div>

      <Button className="cc-auth__submit" type="submit" variant="primary" loading={submitting}>
        {submitting ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
