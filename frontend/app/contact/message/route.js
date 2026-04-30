import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length > 120) {
      return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }
    if (!subject || subject.length > 200) {
      return NextResponse.json({ ok: false, error: "Please enter a subject." }, { status: 400 });
    }
    if (!message || message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Please enter a message (at least 10 characters)." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 400 });
  }
}
