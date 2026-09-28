"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Indian/Antananarivo",
  hour: "2-digit",
  minute: "2-digit",
});

/** Current time in Antananarivo, rendered only on the client. */
export function LocalTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {now ?? "--:--"}
    </time>
  );
}
