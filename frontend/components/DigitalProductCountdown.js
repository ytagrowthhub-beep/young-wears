"use client";

import { useEffect, useMemo, useState } from "react";

function pad(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function DigitChar({ ch, size, variant }) {
  const sz =
    size === "lg"
      ? "h-10 w-9 text-xl sm:h-11 sm:w-10 sm:text-2xl"
      : size === "md"
        ? "h-8 w-7 text-base sm:h-9 sm:w-8 sm:text-lg"
        : "h-6 w-6 text-xs sm:h-7 sm:w-7 sm:text-sm";
  const surface =
    variant === "light"
      ? "border-slate-300 bg-slate-100 text-[#0A1F44] shadow-[inset_0_1px_4px_rgba(255,255,255,0.85)]"
      : "border-emerald-500/35 bg-[#0a1628] text-emerald-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]";
  return (
    <span className={`inline-flex items-center justify-center rounded-md border font-mono font-bold tabular-nums ${sz} ${surface}`}>
      {ch}
    </span>
  );
}

function DigitPair({ value, label, size, variant }) {
  const str = pad(value);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex gap-0.5 sm:gap-1">
        {str.split("").map((ch, i) => (
          <DigitChar key={`${label}-${i}`} ch={ch} size={size} variant={variant} />
        ))}
      </div>
      <span
        className={`text-[9px] font-semibold uppercase tracking-widest ${variant === "light" ? "text-slate-500" : "text-emerald-400/75"}`}
      >
        {label}
      </span>
    </div>
  );
}

function Separator({ variant, size }) {
  const pb = size === "lg" ? "pb-6" : size === "md" ? "pb-5" : "pb-4";
  return (
    <span
      className={`font-bold tabular-nums ${pb} ${size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-xl sm:text-2xl" : "text-lg"} ${variant === "light" ? "text-[#0A1F44]" : "text-emerald-400"}`}
      aria-hidden
    >
      :
    </span>
  );
}

/**
 * LCD-style digital countdown — distinct from the compact `DealCountdown` bar.
 */
export default function DigitalProductCountdown({
  durationHours = 24,
  label = "Offer ends in",
  size = "md",
  variant = "dark",
}) {
  /** Avoid Date.now() during SSR / first paint — it mismatches the client and breaks hydration. */
  const [ready, setReady] = useState(false);
  const [endAt, setEndAt] = useState(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const end = Date.now() + durationHours * 60 * 60 * 1000;
    setEndAt(end);
    setNow(Date.now());
    setReady(true);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [durationHours]);

  const { hours, minutes, seconds } = useMemo(() => {
    if (!ready || endAt == null) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
    const remaining = Math.max(endAt - now, 0);
    const totalSeconds = Math.floor(remaining / 1000);
    const hoursPart = Math.floor(totalSeconds / 3600);
    const minutesPart = Math.floor((totalSeconds % 3600) / 60);
    const secondsPart = totalSeconds % 60;
    return { hours: hoursPart, minutes: minutesPart, seconds: secondsPart };
  }, [ready, endAt, now]);

  const wrap =
    variant === "light"
      ? "rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm sm:px-4 sm:py-3"
      : "rounded-xl border border-white/20 bg-black/40 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3";

  return (
    <div className={wrap}>
      <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${variant === "light" ? "text-slate-500" : "text-white/80"}`}>
        {label}
      </p>
      <div className="flex flex-wrap items-end justify-center gap-1 sm:gap-1.5">
        <DigitPair value={hours} label="hrs" size={size} variant={variant} />
        <Separator variant={variant} size={size} />
        <DigitPair value={minutes} label="min" size={size} variant={variant} />
        <Separator variant={variant} size={size} />
        <DigitPair value={seconds} label="sec" size={size} variant={variant} />
      </div>
    </div>
  );
}
