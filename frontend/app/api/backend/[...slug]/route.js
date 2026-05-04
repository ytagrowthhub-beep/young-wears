import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function resolveBackendOrigin() {
  const u = process.env.BACKEND_URL || process.env.API_URL || "";
  const trimmed = typeof u === "string" ? u.trim() : "";
  if (trimmed) return trimmed.replace(/\/$/, "");
  return "http://127.0.0.1:5000";
}

/**
 * Proxies /api/backend/* → Express /api/* so the browser stays same-origin.
 * Set BACKEND_URL on the Next host (e.g. Vercel) to your deployed API root without /api suffix.
 */
async function proxy(request, { params }) {
  const resolved = await params;
  const segments = resolved?.slug;
  const path = Array.isArray(segments) ? segments.join("/") : String(segments || "");
  const origin = resolveBackendOrigin();
  const target = `${origin}/api/${path}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const auth = request.headers.get("authorization");
  if (auth) headers.set("authorization", auth);

  const init = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  let upstream;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    console.error("[api/backend proxy] fetch failed:", target, err);
    return NextResponse.json(
      {
        message:
          "Cannot reach the Young Wears API. Run the backend locally, set BACKEND_URL on Vercel to your API server, or set NEXT_PUBLIC_API_URL to a full API base URL.",
      },
      { status: 502 }
    );
  }

  const body = await upstream.arrayBuffer();
  const out = new NextResponse(body, { status: upstream.status });
  const ct = upstream.headers.get("content-type");
  if (ct) out.headers.set("content-type", ct);
  return out;
}

export async function GET(req, ctx) {
  return proxy(req, ctx);
}
export async function POST(req, ctx) {
  return proxy(req, ctx);
}
export async function PUT(req, ctx) {
  return proxy(req, ctx);
}
export async function DELETE(req, ctx) {
  return proxy(req, ctx);
}
export async function PATCH(req, ctx) {
  return proxy(req, ctx);
}
