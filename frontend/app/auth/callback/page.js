"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSiteUrl, getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function finish() {
      try {
        const supabase = await getSupabaseBrowserClient();
        const params = new URLSearchParams(window.location.search);
        const oauthFail =
          params.get("error_description") ||
          params.get("error_code") ||
          params.get("error");
        if (oauthFail) {
          const decoded = decodeURIComponent(String(oauthFail).replace(/\+/g, " "));
          throw new Error(decoded);
        }

        const code = params.get("code");
        if (code) {
          const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
          if (codeError) throw codeError;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!session?.user?.email) {
          throw new Error("No OAuth session was returned. Please try Google sign-in again.");
        }

        if (active) router.replace("/profile");
      } catch (err) {
        const msg = String(err?.message || "");
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
  }, [router]);

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
          If you are not redirected, return to{" "}
          <a className="text-[#0A1F44] underline" href={`${getSiteUrl()}/login`}>
            login
          </a>
          .
        </p>
      )}
    </div>
  );
}
