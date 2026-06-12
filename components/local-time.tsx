"use client";

import { useEffect, useState } from "react";

// Live clock for Antananarivo (GMT+3) with a stepped blinking colon.
// Renders empty on the server, fills in after mount to avoid hydration drift.
export function LocalTime() {
  const [time, setTime] = useState<{ h: string; m: string } | null>(null);

  useEffect(() => {
    const update = () => {
      const parts = new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Indian/Antananarivo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      setTime({
        h: parts.find((p) => p.type === "hour")?.value ?? "--",
        m: parts.find((p) => p.type === "minute")?.value ?? "--",
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="inline-block min-w-[5ch] tabular-nums"
      suppressHydrationWarning
    >
      {time ? (
        <>
          {time.h}
          <span className="blink">:</span>
          {time.m}
        </>
      ) : (
        "--:--"
      )}
    </span>
  );
}
