"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getSiteUrl, getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const { register, authConfigError } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      const { needsEmailConfirmation } = await register(form);
      if (needsEmailConfirmation) {
        setInfo("Check your email to confirm your account, then sign in here.");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      setError(err?.message || "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignUp = async () => {
    setError("");
    setGoogleBusy(true);
    try {
      const supabase = await getSupabaseBrowserClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getSiteUrl()}/auth/callback`,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg.toLowerCase().includes("provider is not enabled")) {
        setError("Google sign-up is disabled. Enable Google provider in Supabase Auth.");
      } else {
        setError(msg || "Google sign-up could not start.");
      }
      setGoogleBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold text-[#0A1F44]">Create Account</h1>
      <p className="mt-2 text-sm text-slate-500">Sign up to continue to Young Wears.</p>
      {authConfigError && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
          <p className="font-medium">Sign-up is not configured correctly</p>
          <p className="mt-1 text-amber-900/90">{authConfigError}</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <input className="w-full rounded-lg border border-slate-200 px-3 py-3" placeholder="Full Name" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <input className="w-full rounded-lg border border-slate-200 px-3 py-3" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <input className="w-full rounded-lg border border-slate-200 px-3 py-3" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && <p className="text-sm text-green-600">{info}</p>}
        <button disabled={submitting} className="w-full rounded-lg bg-[#FF7A00] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {submitting ? "Creating account..." : "Create account"}
        </button>
        <button
          type="button"
          onClick={onGoogleSignUp}
          disabled={googleBusy}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {googleBusy ? "Redirecting to Young Wears..." : "Sign up for Young Wears with Google"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already have an account? <Link href="/login" className="text-[#0A1F44]">Login</Link>
      </p>
    </div>
  );
}
