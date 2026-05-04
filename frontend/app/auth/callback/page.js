"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSiteUrl, getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { completeSocialLogin } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function finish() {
      try {
        const supabase = await getSupabaseBrowserClient();
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) throw codeError;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const session = data?.session;
        const user = session?.user;

        if (!session?.access_token || !user?.email) {
          throw new Error("No OAuth session was returned. Please try Google sign-in again.");
        }

        await completeSocialLogin({
          accessToken: session.access_token,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split("@")[0],
          avatarUrl: user.user_metadata?.avatar_url || "",
          providerUserId: user.id,
        });

        await supabase.auth.signOut();
        if (active) router.replace("/profile");
      } catch (err) {
        const msg = String(err?.response?.data?.message || err?.message || "");
        if (active) {
          if (msg.toLowerCase().includes("provider is not enabled")) {
            setError("Google provider is disabled in Supabase Auth settings.");
          } else {
            setError(msg || "Google sign-in failed. Please try again.");
          }
        }
      }
    }

    finish();
    return () => {
      active = false;
    };
  }, [completeSocialLogin, router]);

  return (
    <div className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-[#0A1F44]">Completing sign-in...</h1>
      {error ? (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      ) : (
        <p className="mt-3 text-sm text-slate-600">Please wait while we secure your account.</p>
      )}
      {!error && (
        <p className="mt-4 text-xs text-slate-500">
          If you are not redirected, return to <a className="text-[#0A1F44] underline" href={`${getSiteUrl()}/login`}>login</a>.
        </p>
      )}
    </div>
  );
}
