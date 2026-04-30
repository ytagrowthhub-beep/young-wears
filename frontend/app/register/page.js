"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { getSiteUrl, getSupabaseClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      router.push("/profile");
    } catch {
      setError("Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignUp = async () => {
    setError("");
    setGoogleBusy(true);
    try {
      const supabase = getSupabaseClient();
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
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <input className="w-full rounded-lg border border-slate-200 px-3 py-3" placeholder="Full Name" required value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <input className="w-full rounded-lg border border-slate-200 px-3 py-3" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <input className="w-full rounded-lg border border-slate-200 px-3 py-3" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={submitting} className="w-full rounded-lg bg-[#FF7A00] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {submitting ? "Creating account..." : "Create account"}
        </button>
        <button
          type="button"
          onClick={onGoogleSignUp}
          disabled={googleBusy}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {googleBusy ? "Redirecting..." : "Sign up with Google"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        Already have an account? <Link href="/login" className="text-[#0A1F44]">Login</Link>
      </p>
    </div>
  );
}
