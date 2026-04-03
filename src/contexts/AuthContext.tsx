import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, API_BASE } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithProvider: (provider: "google" | "github") => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api<{ user: User }>("/api/auth/get-session");
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await api<{ user: User; token: string }>(
      "/api/auth/sign-in/email",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    if (data.token) localStorage.setItem("auth_token", data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api<{ user: User; token: string }>(
      "/api/auth/sign-up/email",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }
    );
    if (data.token) localStorage.setItem("auth_token", data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await api("/api/auth/sign-out", { method: "POST" }).catch(() => {});
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const loginWithProvider = (provider: "google" | "github") => {
    window.location.href = `${API_BASE}/api/auth/sign-in/social?provider=${provider}&callbackURL=${encodeURIComponent(window.location.origin + "/dashboard")}`;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithProvider, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
