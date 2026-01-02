const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string) {
  if (!value) return "Email is required";
  if (!emailRegex.test(value.trim())) return "Enter a valid email address";
  return null;
}

export function validatePassword(value: string) {
  if (!value) return "Password is required";
  if (value.length < 8) return "Use at least 8 characters";
  return null;
}

export function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return "Confirm your password";
  if (password !== confirm) return "Passwords must match";
  return null;
}

export function validateName(value: string) {
  if (!value.trim()) return "Name is required";
  if (value.trim().length < 2) return "Name is too short";
  return null;
}

export function validateTitle(value: string) {
  if (!value.trim()) return "Title is required";
  return null;
}

export function validateBody(value: string) {
  if (!value.trim()) return "Content is required";
  return null;
}

export function validateNonEmpty(value: string, field: string) {
  if (!value.trim()) return `${field} is required`;
  return null;
}
