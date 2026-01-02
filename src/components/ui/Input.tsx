"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label: string;
  error?: string | null;
  hint?: string;
  name: string;
  required?: boolean;
};

type FieldProps = BaseProps &
  (
    | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
    | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

export function InputField(props: FieldProps) {
  const { label, name, error, hint, required, multiline, ...rest } = props;
  return (
    <div className="cc-field">
      <label htmlFor={name}>
        {label}
        {required ? " *" : null}
      </label>
      {multiline ? (
        <textarea id={name} name={name} className="cc-input" aria-invalid={!!error} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={name} name={name} className="cc-input" aria-invalid={!!error} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {hint && !error && <p className="cc-formhint">{hint}</p>}
      {error && <p className="cc-formhint" style={{ color: "#fca5a5" }}>{error}</p>}
    </div>
  );
}
