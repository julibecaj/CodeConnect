import type { CurrentUser } from "./user";

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

// Session transport is an adapter concern and is not exposed to the UI.
export type AuthResult = {
  user: CurrentUser;
};
