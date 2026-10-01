import type { ReactNode } from "react";
import { CoderAvatar } from "./coder-avatar";
import { HeroAvatar } from "./hero-avatar";

/**
 * Hero diagram: problems and the stack flow into a core node (an illustrated
 * portrait, coding), which ships solutions as Web / Mobile / API. Beams are
 * pure CSS dash animations on a shared 4s cycle (see `.beam`, `.core-ring`,
 * `.pill-hit` in globals.css); the glyphs riding them use SMIL, so this stays
 * a server component.
 */

const INPUTS = [
  { x: 50, label: "Next.js" },
  { x: 150, label: "Flutter" },
  { x: 250, label: "Nest.js" },
  { x: 350, label: "LLM" },
];

const OUTPUTS = [
  { x: 80, label: "Web" },
  { x: 200, label: "Mobile" },
  { x: 320, label: "API" },
];

const IN_DELAYS = [0.1, 0, 0.05, 0.15];
const OUT_DELAYS = [0.08, 0, 0.12];
// Problems riding the inbound beams.
const PROBLEMS = ["?", "!", "bug", "?"];

// Core box: 136px square centred on (200, 240).
const VIEW = { w: 400, h: 480 };
const CORE = { x: 132, y: 172, size: 136, rx: 28 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
// The Rive avatar sits over the core box, inset so the box outline shows.
const AVATAR_BOX = {
  left: `calc(${pct(CORE.x, VIEW.w)} + 1.5px)`,
  top: `calc(${pct(CORE.y, VIEW.h)} + 1.5px)`,
  width: `calc(${pct(CORE.size, VIEW.w)} - 3px)`,
  height: `calc(${pct(CORE.size, VIEW.h)} - 3px)`,
  borderRadius: pct(CORE.rx, CORE.size),
};

const inPath = (x: number) => `M${x} 50 C${x} 115, 200 115, 200 172`;
const outPath = (x: number) => `M200 308 C200 365, ${x} 365, ${x} 430`;

function Pill({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x - 42}
        y={y}
        width="84"
        height="30"
        rx="15"
        className="fill-bg stroke-line-strong"
      />
      <text
        x={x}
        y={y + 19.5}
        textAnchor="middle"
        className="fill-fg font-mono text-[11.5px]"
      >
        {label}
      </text>
    </g>
  );
}

/** Keeps a glyph at the head of its beam: same cycle, keyframes and easing
 *  as `.beam` / `.beam-out`. */
function Rider({
  path,
  delay,
  inbound,
  children,
}: {
  path: string;
  delay: number;
  inbound: boolean;
  children: ReactNode;
}) {
  const timing = { dur: "4s", begin: `${delay}s`, repeatCount: "indefinite" };
  return (
    <g className="beam-rider" opacity="0">
      {children}
      <animateMotion
        {...timing}
        path={path}
        calcMode="spline"
        keyTimes={inbound ? "0;0.4;1" : "0;0.45;0.85;1"}
        keyPoints={inbound ? "0;1;1" : "0;0;1;1"}
        keySplines={
          inbound ? "0.6 0 0.4 1;0 0 1 1" : "0 0 1 1;0.6 0 0.4 1;0 0 1 1"
        }
      />
      <animate
        {...timing}
        attributeName="opacity"
        values={inbound ? "0;1;1;0;0" : "0;0;1;1;0;0"}
        keyTimes={inbound ? "0;0.05;0.3;0.37;1" : "0;0.47;0.52;0.8;0.86;1"}
      />
    </g>
  );
}

// Stroke-only glyphs, drawn around (0, 0).
const GLYPHS: Record<string, string> = {
  "?": "M-2.2-2.4a2.2 2.2 0 1 1 3.1 2c-.7.3-.9.8-.9 1.5M0 3.4v.1",
  "!": "M0-3.6v4.2M0 3.4v.1",
  bug: "M-2.2-0.8a2.2 2.2 0 0 1 4.4 0v2.2a2.2 2.2 0 0 1-4.4 0ZM-2.2 0h-2M2.2 0h2M-2.2 2.2l-1.8 1.2M2.2 2.2l1.8 1.2M-1.2-2.6l-1-1.4M1.2-2.6l1-1.4",
  check: "M-3.4 0.2l2.3 2.3L3.6-2.5",
};

function Glyph({ kind }: { kind: string }) {
  const solved = kind === "check";
  return (
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={solved ? "stroke-fg" : "stroke-muted"}
    >
      <circle
        r="8"
        className={solved ? "fill-bg stroke-fg" : "fill-bg stroke-line-strong"}
        strokeWidth="1.1"
      />
      <path d={GLYPHS[kind]} strokeWidth="1.4" />
    </g>
  );
}

export function HeroBeams({ label }: { label: string }) {
  return (
    <div className="relative w-full max-w-[420px]">
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="block h-auto w-full"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient
            id="beam-grad"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="40"
            x2="0"
            y2="440"
          >
            <stop offset="0" style={{ stopColor: "var(--accent-2)" }} />
            <stop offset="0.5" style={{ stopColor: "var(--accent)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
          </linearGradient>
          <filter id="beam-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <radialGradient id="core-grad">
            <stop offset="0" style={{ stopColor: "var(--accent)" }} />
            <stop
              offset="1"
              style={{ stopColor: "var(--accent)", stopOpacity: 0 }}
            />
          </radialGradient>
        </defs>

        {/* Rails */}
        <g fill="none" strokeWidth="1" className="stroke-line-strong">
          {INPUTS.map((n) => (
            <path key={n.label} d={inPath(n.x)} />
          ))}
          {OUTPUTS.map((n) => (
            <path key={n.label} d={outPath(n.x)} />
          ))}
        </g>

        {/* Beams: a blurred copy underneath gives the glow */}
        {["glow", "core"].map((layer) => (
          <g
            key={layer}
            fill="none"
            stroke="url(#beam-grad)"
            strokeLinecap="round"
            strokeWidth={layer === "glow" ? 4 : 1.75}
            filter={layer === "glow" ? "url(#beam-blur)" : undefined}
            opacity={layer === "glow" ? 0.7 : 1}
          >
            {INPUTS.map((n, i) => (
              <path
                key={n.label}
                d={inPath(n.x)}
                pathLength={100}
                className="beam"
                style={{ animationDelay: `${IN_DELAYS[i]}s` }}
              />
            ))}
            {OUTPUTS.map((n, i) => (
              <path
                key={n.label}
                d={outPath(n.x)}
                pathLength={100}
                className="beam beam-out"
                style={{ animationDelay: `${OUT_DELAYS[i]}s` }}
              />
            ))}
          </g>
        ))}

        {/* Problems in, solutions out */}
        {INPUTS.map((n, i) => (
          <Rider key={n.label} path={inPath(n.x)} delay={IN_DELAYS[i]} inbound>
            <Glyph kind={PROBLEMS[i]} />
          </Rider>
        ))}
        {OUTPUTS.map((n, i) => (
          <Rider
            key={n.label}
            path={outPath(n.x)}
            delay={OUT_DELAYS[i]}
            inbound={false}
          >
            <Glyph kind="check" />
          </Rider>
        ))}

        {INPUTS.map((n) => (
          <Pill key={n.label} x={n.x} y={20} label={n.label} />
        ))}

        {OUTPUTS.map((n, i) => (
          <g key={n.label}>
            <Pill x={n.x} y={430} label={n.label} />
            <rect
              x={n.x - 42}
              y={430}
              width="84"
              height="30"
              rx="15"
              fill="none"
              strokeWidth="1.25"
              className="pill-hit stroke-accent"
              style={{ animationDelay: `${OUT_DELAYS[i]}s` }}
            />
          </g>
        ))}

        {/* Core: the portrait, coding */}
        <circle
          cx="200"
          cy="240"
          r="96"
          fill="url(#core-grad)"
          className="core-glow"
        />
        <rect
          x={CORE.x}
          y={CORE.y}
          width={CORE.size}
          height={CORE.size}
          rx={CORE.rx}
          className="fill-bg stroke-line-strong"
        />
        <CoderAvatar x={CORE.x} y={CORE.y} size={CORE.size} />
        <rect
          x={CORE.x}
          y={CORE.y}
          width={CORE.size}
          height={CORE.size}
          rx={CORE.rx}
          fill="none"
          strokeWidth="1.25"
          className="core-ring stroke-accent"
        />
      </svg>
      <HeroAvatar style={AVATAR_BOX} />
    </div>
  );
}
