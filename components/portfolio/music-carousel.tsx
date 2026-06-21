"use client";

import { useRef } from "react";
import { albums, slots } from "@/lib/portfolio-data";

export function MusicCarousel({
  head,
  onAdvance,
}: {
  head: number;
  // delta: +1 (next) or +4 (previous, mod 5) — matches the prototype's swipe math
  onAdvance: (delta: number) => void;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return (
    <div
      title="Glisser pour changer"
      onPointerDown={(e) => {
        start.current = { x: e.clientX, y: e.clientY };
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }}
      onPointerUp={(e) => {
        const s = start.current;
        const dx = e.clientX - (s?.x ?? e.clientX);
        const dy = e.clientY - (s?.y ?? e.clientY);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        if (Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy)) {
          onAdvance(dx < 0 ? 1 : 4);
        }
      }}
      style={{
        position: "relative",
        height: 150,
        margin: "6px -24px 24px",
        cursor: "grab",
        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      {albums.map((url, idx) => {
        const s = (idx - head + 5) % 5;
        const sl = slots[s];
        const center = s === 2;
        return (
          // biome-ignore lint/performance/noImgElement: dynamically swapped coverflow art, not a static asset
          <img
            key={url}
            src={url}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 120,
              height: 120,
              borderRadius: 14,
              objectFit: "cover",
              transform: `translate(-50%,-50%) translate(${sl.x}px,${sl.y}px) rotate(${sl.deg}deg) scale(${sl.scale})`,
              zIndex: sl.z,
              opacity: sl.op,
              boxShadow: center
                ? "0 14px 30px rgba(0,0,0,.28)"
                : "0 8px 16px rgba(0,0,0,.18)",
              border: center
                ? "3px solid #fff"
                : "1px solid rgba(255,255,255,.45)",
              transition:
                "transform .75s cubic-bezier(.34,.08,.18,1),opacity .6s ease,box-shadow .6s ease",
              willChange: "transform",
              pointerEvents: "none",
            }}
          />
        );
      })}
      {/* equalizer badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%) translate(-32px,16px)",
          zIndex: 7,
          display: "flex",
          alignItems: "flex-end",
          gap: 2.5,
          height: 17,
          background: "rgba(20,20,20,.5)",
          backdropFilter: "blur(4px)",
          padding: "5px 7px",
          borderRadius: 9,
          pointerEvents: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,.25)",
        }}
      >
        {[0, 0.18, 0.36, 0.54].map((delay) => (
          <span
            key={delay}
            style={{
              width: 3,
              borderRadius: 2,
              background: "var(--accent,#f2611a)",
              height: 5,
              animation: `eq .9s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
