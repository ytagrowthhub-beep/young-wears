"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return Boolean(localStorage.getItem("yw_token"));
  });

  useEffect(() => {
    const token = localStorage.getItem("yw_token");
    if (!token) return;
    setAuthToken(token);
    api
      .get("/profile")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("yw_token");
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("yw_token", res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const login = async (payload) => {
    const res = await api.post("/auth/login", payload);
    localStorage.setItem("yw_token", res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const completeSocialLogin = async (payload) => {
    const res = await api.post("/auth/google/supabase", payload);
    localStorage.setItem("yw_token", res.data.token);
    setAuthToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("yw_token");
    setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const res = await api.put("/profile", payload);
    setUser(res.data);
  };

  const deleteProfile = async () => {
    await api.delete("/profile");
    logout();
  };

  const value = { user, loading, register, login, completeSocialLogin, logout, updateProfile, deleteProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
