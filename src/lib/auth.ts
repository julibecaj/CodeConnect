"use client";

import { AuthResponse } from "./types";
import { clientEnv } from "./env/client";

const TOKEN_KEY = "cc_jwt_token";
const REFRESH_TOKEN_KEY = "cc_refresh_token";

export const USE_JWT = clientEnv.useJwt;

export function getStoredToken(): string | null {
  if (typeof window === "undefined" || !USE_JWT) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined" || !USE_JWT) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function persistAuthTokens(payload?: Pick<AuthResponse, "token" | "refreshToken">) {
  if (typeof window === "undefined" || !USE_JWT) return;
  if (payload?.token) {
    localStorage.setItem(TOKEN_KEY, payload.token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (payload?.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearAuthTokens() {
  persistAuthTokens(undefined);
}

export function authHeaders() {
  const headers: Record<string, string> = {};
  if (!USE_JWT) return headers;

  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function credentialsMode(): RequestCredentials {
  return USE_JWT ? "same-origin" : "include";
}
