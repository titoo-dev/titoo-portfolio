"use client";

import { type ComponentPropsWithoutRef, useEffect, useRef } from "react";

type InViewProps = ComponentPropsWithoutRef<"div"> & {
  /** Fraction of the element that must be visible before it triggers. */
  threshold?: number;
};

/**
 * Flips `data-inview="true"` the first time the element scrolls into view.
 * CSS hooks off the attribute (`.reveal`, `.draw`), so children stay server
 * components.
 */
export function InView({ threshold = 0.25, ...props }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = "true";
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return <div ref={ref} data-inview="false" {...props} />;
}
