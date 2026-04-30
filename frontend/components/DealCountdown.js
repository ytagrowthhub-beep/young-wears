"use client";

import { useEffect, useMemo, useState } from "react";

function pad(value) {
  return String(value).padStart(2, "0");
}

export default function DealCountdown({ durationHours = 48 }) {
  const [endAt] = useState(() => Date.now() + durationHours * 60 * 60 * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { hours, minutes, seconds } = useMemo(() => {
    const remaining = Math.max(endAt - now, 0);
    const totalSeconds = Math.floor(remaining / 1000);
    const hoursPart = Math.floor(totalSeconds / 3600);
    const minutesPart = Math.floor((totalSeconds % 3600) / 60);
    const secondsPart = totalSeconds % 60;
    return { hours: pad(hoursPart), minutes: pad(minutesPart), seconds: pad(secondsPart) };
  }, [endAt, now]);

  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-4 py-2 text-white">
      <span className="text-xs uppercase tracking-wide text-slate-200">Deal ends in</span>
      <span className="text-sm font-semibold">{hours}:{minutes}:{seconds}</span>
    </div>
  );
}
