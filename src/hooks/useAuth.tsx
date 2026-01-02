"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { clearAuthTokens, persistAuthTokens, USE_JWT } from "../lib/auth";
import type { AuthResponse, User } from "../lib/types";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  authMode: "cookie" | "jwt";
  error?: string | null;
  login: (input: { email: string; password: string }) => Promise<AuthResponse>;
  signup: (input: { name: string; email: string; password: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const authMode = USE_JWT ? "jwt" : "cookie";

  const bootstrap = useCallback(async () => {
    setStatus("loading");
    try {
      const me = await api.me();
      setUser(me);
      setStatus("authenticated");
    } catch (err) {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      setStatus("loading");
      setError(null);
      try {
        const res = await api.login(input);
        if (USE_JWT) persistAuthTokens(res);
        setUser(res.user);
        setStatus("authenticated");
        return res;
      } catch (err) {
        setStatus("unauthenticated");
        const message = err instanceof Error ? err.message : "Unable to log in";
        setError(message);
        throw err;
      }
    },
    [],
  );

  const signup = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      setStatus("loading");
      setError(null);
      try {
        const res = await api.signup(input);
        if (USE_JWT) persistAuthTokens(res);
        setUser(res.user);
        setStatus("authenticated");
        return res;
      } catch (err) {
        setStatus("unauthenticated");
        const message = err instanceof Error ? err.message : "Unable to sign up";
        setError(message);
        throw err;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setStatus("loading");
    try {
      await api.logout();
    } catch (err) {
      // ignore logout errors; tokens are cleared below
    } finally {
      clearAuthTokens();
      setUser(null);
      setStatus("unauthenticated");
      router.replace("/login");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me);
      setStatus("authenticated");
      return me;
    } catch (err) {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      authMode,
      error,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [user, status, authMode, error, login, signup, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
