import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function trim(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  const authHeader = request.headers.get("authorization") || "";
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!jwt) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const ref = trim(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF);
  const url =
    trim(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    trim(process.env.SUPABASE_URL) ||
    (ref ? `https://${ref}.supabase.co` : "");
  const anonKey =
    trim(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    trim(process.env.SUPABASE_PUBLISHABLE_KEY) ||
    trim(process.env.SUPABASE_ANON_KEY);
  const serviceRole = trim(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !anonKey || !serviceRole) {
    return NextResponse.json(
      {
        message:
          "Account deletion is not configured. Add SUPABASE_SERVICE_ROLE_KEY (Supabase Dashboard → Settings → API → service_role secret) to frontend/.env.local.",
      },
      { status: 503 }
    );
  }

  const anonClient = createClient(url, anonKey);
  const {
    data: { user },
    error: userErr,
  } = await anonClient.auth.getUser(jwt);

  if (userErr || !user?.id) {
    return NextResponse.json({ message: "Invalid session." }, { status: 401 });
  }

  const admin = createClient(url, serviceRole);
  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) {
    return NextResponse.json({ message: delErr.message || "Could not delete account." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
