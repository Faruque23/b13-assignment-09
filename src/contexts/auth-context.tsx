"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import type { UserSafe } from "@/types";

type Credentials = { email: string; password: string };
type Registration = {
  name: string;
  email: string;
  photoUrl: string;
  password: string;
};

type AuthContextValue = {
  user: UserSafe | null;
  token: string | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (payload: Registration) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
};

const tokenKey = "tutornest_token";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = (await res.json()) as T & { message?: string };
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSafe | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async (rawToken: string | null) => {
    if (!rawToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const data = await request<{ user: UserSafe }>("/api/auth/me", {
        headers: { Authorization: `Bearer ${rawToken}` },
      });
      setUser(data.user);
      setToken(rawToken);
    } catch {
      localStorage.removeItem(tokenKey);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(tokenKey);
    void hydrate(saved);
  }, [hydrate]);

  const login = useCallback(async (credentials: Credentials) => {
    const data = await request<{ token: string; user: UserSafe }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
    );
    localStorage.setItem(tokenKey, data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success("Welcome back!");
  }, []);

  const register = useCallback(async (payload: Registration) => {
    await request<{ token: string; user: UserSafe }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    toast.success("Registration successful. Please login now.");
  }, []);

  const googleLogin = useCallback(async (credential: string) => {
    if (!credential) {
      throw new Error("Missing Google credential token.");
    }

    const data = await request<{ token: string; user: UserSafe }>(
      "/api/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ credential }),
      },
    );
    localStorage.setItem(tokenKey, data.token);
    setToken(data.token);
    setUser(data.user);
    toast.success("Google sign-in successful.");
  }, []);

  const logout = useCallback(async () => {
    await request<{ ok: boolean }>("/api/auth/me", { method: "DELETE" });
    localStorage.removeItem(tokenKey);
    setToken(null);
    setUser(null);
    toast.success("You have been logged out.");
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, googleLogin, logout }),
    [googleLogin, loading, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
