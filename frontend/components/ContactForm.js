"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("sending");

    try {
      const res = await fetch("/contact/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not send your message. Try again.");
        setStatus("idle");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-semibold">Thanks for reaching out.</p>
        <p className="mt-2 text-sm text-emerald-800">
          We&apos;ve received your message and will reply as soon as we can.
        </p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-emerald-900 underline underline-offset-2 hover:no-underline"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-[#0A1F44]/20 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-[#0A1F44]/20 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-[#0A1F44]/20 focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-4 py-3 outline-none ring-[#0A1F44]/20 focus:ring-2"
          placeholder="How can we help?"
        />
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-[#FF7A00] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
