"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, useCallback, useEffect, useState } from "react";

const RiveAvatar = dynamic(() => import("./rive-avatar"), { ssr: false });

/**
 * Lays the interactive Rive avatar over the hero diagram's core box. The
 * static SVG portrait underneath stays as the server-rendered fallback, and
 * is all a reduced-motion visitor gets.
 */
export function HeroAvatar({ style }: { style: CSSProperties }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    setEnabled(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      style={style}
      className={`absolute overflow-hidden bg-bg transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <RiveAvatar onReady={onReady} />
    </div>
  );
}
