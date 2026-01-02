"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import type { ApiRequestError } from "../../lib/api";
import { validateConfirmPassword, validateEmail, validateName, validatePassword } from "../../lib/validators";
import { Button } from "../ui/Button";
import { InputField } from "../ui/Input";

type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {
      name: validateName(name) || undefined,
      email: validateEmail(email) || undefined,
      password: validatePassword(password) || undefined,
      confirm: validateConfirmPassword(password, confirm) || undefined,
    };
    setErrors(nextErrors);
    setFormError(null);

    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await signup({ name, email, password });
      addToast({ type: "success", message: "Account created. Welcome!" });
      router.replace("/login?from=signup");
    } catch (err) {
      const message = (err as ApiRequestError)?.message || "Signup failed. Please try again.";
      setFormError(message);
      addToast({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cc-formgrid">
      {formError && (
        <p className="cc-formhint" style={{ color: "#fca5a5" }}>
          {formError}
        </p>
      )}

      <InputField
        label="Full name"
        name="name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        error={errors.name}
      />

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
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={errors.password}
      />

      <InputField
        label="Confirm password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        error={errors.confirm}
      />

      <div className="cc-auth__actions">
        <label>
          <input type="checkbox" name="terms" required /> I agree to the Terms and Privacy.
        </label>
        <a className="cc-auth__link" href="#community">
          Community guidelines
        </a>
      </div>

      <Button className="cc-auth__submit" type="submit" variant="primary" loading={submitting}>
        {submitting ? "Creating account..." : "Sign Up"}
      </Button>
    </form>
  );
}
