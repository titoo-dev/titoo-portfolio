"use client";

import { useEffect, useRef, useState } from "react";
import type { Career } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

/**
 * Career timeline whose SVG rail draws itself as the page scrolls; each node
 * switches on once the rail reaches it.
 */
type Props = { items: Career[]; detailsLabel: string };

export function Timeline({ items, detailsLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<SVGLineElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const anchor = window.innerHeight * 0.6;
      const rect = root.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (anchor - rect.top) / rect.height),
      );
      rail.style.strokeDashoffset = String(1 - progress);
      const count = itemRefs.current.filter(
        (el) => el && el.getBoundingClientRect().top + 10 < anchor,
      ).length;
      setReached(count);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative px-6 pb-16 md:px-10">
      <svg
        className="absolute top-2 left-[34px] w-[3px] md:left-[50px]"
        style={{ height: "calc(100% - 4.5rem)" }}
        aria-hidden="true"
      >
        <line
          x1="1.5"
          y1="0"
          x2="1.5"
          y2="100%"
          strokeWidth="1"
          className="stroke-line-strong"
        />
        <line
          ref={railRef}
          x1="1.5"
          y1="0"
          x2="1.5"
          y2="100%"
          pathLength={1}
          strokeWidth="1.5"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="stroke-fg"
        />
      </svg>

      <ol className="space-y-12">
        {items.map((c, i) => {
          const on = i < reached;
          return (
            <li
              key={c.company}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative pl-10"
            >
              <Node on={on} current={c.current} />
              <div
                className={cn(
                  "transition-opacity duration-500",
                  on ? "opacity-100" : "opacity-45",
                )}
              >
                <p className="font-mono text-muted text-xs">
                  {c.period} · {c.type}
                </p>
                <h3 className="mt-2 font-medium text-lg tracking-tight">
                  {c.role} <span className="text-muted">· {c.company}</span>
                </h3>
                <p className="mt-2 max-w-2xl text-muted text-sm leading-relaxed">
                  {c.summary}
                </p>
                {c.skills.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {c.skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                {c.responsibilities.length + c.achievements.length > 0 && (
                  <details className="group mt-4 max-w-2xl text-sm">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-mono text-muted text-xs transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        aria-hidden="true"
                        className="transition-transform group-open:rotate-90"
                      >
                        <path
                          d="M3 1.5 6.5 5 3 8.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                      </svg>
                      {detailsLabel}
                    </summary>
                    <ul className="mt-3 space-y-1.5 text-muted leading-relaxed">
                      {[...c.responsibilities, ...c.achievements].map((r) => (
                        <li key={r} className="flex gap-2.5">
                          <span className="mt-[9px] h-px w-2.5 shrink-0 bg-line-strong" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Node({ on, current }: { on: boolean; current: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      overflow="visible"
      aria-hidden="true"
      className="absolute top-0.5 left-[5px]"
    >
      {current && on && (
        <circle cx="6.5" cy="6.5" r="3" className="pulse-ring fill-success" />
      )}
      <circle
        cx="6.5"
        cy="6.5"
        r="5.5"
        strokeWidth="1.25"
        className={cn(
          "fill-bg transition-colors duration-500",
          on ? "stroke-fg" : "stroke-line-strong",
        )}
      />
      <circle
        cx="6.5"
        cy="6.5"
        r="2.5"
        className={cn(
          "transition-all duration-500",
          on ? (current ? "fill-success" : "fill-fg") : "fill-transparent",
        )}
      />
    </svg>
  );
}
