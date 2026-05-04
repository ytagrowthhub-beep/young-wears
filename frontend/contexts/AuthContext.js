"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

function mapProfile(authUser) {
  if (!authUser) return null;
  const meta = authUser.user_metadata || {};
  return {
    id: authUser.id,
    email: authUser.email || "",
    name: meta.full_name || meta.name || authUser.email?.split("@")[0] || "",
    phone: meta.phone || "",
    address: meta.address || "",
    profilePicture: meta.avatar_url || meta.profile_picture || "",
  };
}

function normalizeAuthError(error) {
  const msg =
    (typeof error?.message === "string" && error.message) ||
    (typeof error?.msg === "string" && error.msg) ||
    (typeof error?.error_description === "string" && error.error_description) ||
    "Something went wrong.";
  return new Error(msg);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  /** Set when Supabase URL/key are missing or /api/supabase-env fails — blocks meaningful sign-in until env is fixed. */
  const [authConfigError, setAuthConfigError] = useState(null);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    (async () => {
      try {
        const supabase = await getSupabaseBrowserClient();
        if (active) setAuthConfigError(null);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (active) setUser(session?.user ? mapProfile(session.user) : null);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (active) setUser(session?.user ? mapProfile(session.user) : null);
        });
        unsubscribe = () => subscription.unsubscribe();
      } catch (e) {
        if (active) {
          console.error("Auth init:", e);
          setAuthConfigError(e?.message || "Could not initialize authentication.");
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  /**
   * @returns {Promise<{ needsEmailConfirmation: boolean }>}
   */
  const register = async (payload) => {
    const supabase = await getSupabaseBrowserClient();
    setAuthConfigError(null);
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim(),
      password: payload.password,
      options: {
        data: {
          full_name: payload.name,
          name: payload.name,
          phone: "",
          address: "",
          profile_picture: "",
        },
      },
    });
    if (error) throw normalizeAuthError(error);
    if (data.session?.user) {
      setUser(mapProfile(data.user));
      return { needsEmailConfirmation: false };
    }
    return { needsEmailConfirmation: true };
  };

  const login = async (payload) => {
    const supabase = await getSupabaseBrowserClient();
    setAuthConfigError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email.trim(),
      password: payload.password,
    });
    if (error) throw normalizeAuthError(error);
    if (data.user) setUser(mapProfile(data.user));
  };

  const logout = async () => {
    try {
      const supabase = await getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (_) {
      /* clear UI even if network fails */
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (payload) => {
    const supabase = await getSupabaseBrowserClient();
    setAuthConfigError(null);
    const {
      data: { user: current },
      error: guErr,
    } = await supabase.auth.getUser();
    if (guErr || !current) throw normalizeAuthError(guErr || new Error("Not signed in."));

    const meta = {
      ...current.user_metadata,
      full_name: payload.name ?? current.user_metadata?.full_name ?? "",
      name: payload.name ?? current.user_metadata?.name ?? "",
      phone: payload.phone ?? "",
      address: payload.address ?? "",
      profile_picture: payload.profilePicture ?? "",
    };

    const updates = { data: meta };
    const nextEmail = (payload.email ?? "").trim();
    if (nextEmail && nextEmail !== (current.email || "")) {
      updates.email = nextEmail;
    }

    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw normalizeAuthError(error);
    if (data.user) setUser(mapProfile(data.user));
  };

  const deleteProfile = async () => {
    const supabase = await getSupabaseBrowserClient();
    setAuthConfigError(null);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Not signed in.");

    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.message || "Could not delete account.");

    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    authConfigError,
    register,
    login,
    logout,
    updateProfile,
    deleteProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
