"use client";

import { domAnimation, LazyMotion, m } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  /** Starting state; animates to neutral (opacity 1, x/y 0, scale 1). */
  from?: { opacity?: number; x?: number; y?: number; scale?: number };
  /** true (default): animate when scrolled into view, once. false: animate on mount. */
  inView?: boolean;
};

const TARGET = { opacity: 1, x: 0, y: 0, scale: 1 };

export function Reveal({
  children,
  className,
  style,
  delay = 0,
  duration = 0.4,
  from = { opacity: 0, y: 20 },
  inView = true,
}: RevealProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        style={style}
        initial={from}
        {...(inView
          ? { whileInView: TARGET, viewport: { once: true } }
          : { animate: TARGET })}
        transition={{ delay, duration }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
