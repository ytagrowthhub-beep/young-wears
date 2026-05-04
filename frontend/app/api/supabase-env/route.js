import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function trim(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const ref = trim(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF);
  const url =
    trim(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    trim(process.env.SUPABASE_URL) ||
    (ref ? `https://${ref}.supabase.co` : "");
  const key =
    trim(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
    trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    trim(process.env.SUPABASE_PUBLISHABLE_KEY) ||
    trim(process.env.SUPABASE_ANON_KEY);

  if (!url || !key) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured on the server. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) to frontend/.env.local, restart dev, or add them in Vercel → Settings → Environment Variables and redeploy.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ url, key });
}
