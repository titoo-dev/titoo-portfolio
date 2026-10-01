"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, useEffect, useState } from "react";
import type { Replies, Thought } from "./rive-avatar";

const RiveScene = dynamic(() => import("./rive-avatar"), { ssr: false });

/**
 * Lays the interactive Rive avatar over the hero diagram's core box, with its
 * thought bubble above it. The static SVG portrait underneath stays as the
 * server-rendered fallback, and is all a reduced-motion visitor gets.
 */
export function HeroAvatar({
  style,
  thoughtStyle,
  thoughts,
  replies,
}: {
  style: CSSProperties;
  thoughtStyle: CSSProperties;
  thoughts: Thought[];
  replies: Replies;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return null;
  return (
    <RiveScene
      avatarStyle={style}
      thoughtStyle={thoughtStyle}
      thoughts={thoughts}
      replies={replies}
    />
  );
}
