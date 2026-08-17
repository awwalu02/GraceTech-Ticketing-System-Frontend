"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiFetch, setToken } from "@/lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "itsupport_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore malformed/unavailable storage
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextUser) => {
    setUser(nextUser);
    try {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Checks a few common field names for the auth token — the documented
  // shape uses "token", but FastAPI/OAuth2 backends very commonly return
  // "access_token" instead. Trying both makes this resilient regardless of
  // which convention the real backend actually uses.
  const extractToken = (data) => data.token || data.access_token || data.accessToken;

  const login = useCallback(
    async (email, password) => {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const token = extractToken(data);
      if (token) setToken(token);
      persist(data.user);
      return data.user;
    },
    [persist]
  );

  // Every signup comes back as role: "employee" — enforced server-side
  // regardless of anything the client sends.
  const signup = useCallback(
    async (name, email, password) => {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      const token = extractToken(data);
      if (token) setToken(token);
      persist(data.user);
      return data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    persist(null);
  }, [persist]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}