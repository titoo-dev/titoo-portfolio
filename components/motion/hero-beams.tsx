/**
 * Hero diagram: the stack flows into a core node, which ships Web / Mobile /
 * API. Beams are pure CSS dash animations on a shared 4s cycle (see
 * `.beam`, `.core-ring`, `.pill-hit` in globals.css), so this stays a server
 * component.
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

const inPath = (x: number) => `M${x} 50 C${x} 125, 200 125, 200 200`;
const outPath = (x: number) => `M200 280 C200 355, ${x} 355, ${x} 430`;

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

export function HeroBeams({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 400 480"
      className="h-auto w-full max-w-[420px]"
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
              style={{ animationDelay: `${[0.1, 0, 0.05, 0.15][i]}s` }}
            />
          ))}
          {OUTPUTS.map((n, i) => (
            <path
              key={n.label}
              d={outPath(n.x)}
              pathLength={100}
              className="beam beam-out"
              style={{ animationDelay: `${[0.08, 0, 0.12][i]}s` }}
            />
          ))}
        </g>
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
            style={{ animationDelay: `${[0.08, 0, 0.12][i]}s` }}
          />
        </g>
      ))}

      {/* Core */}
      <circle
        cx="200"
        cy="240"
        r="70"
        fill="url(#core-grad)"
        className="core-glow"
      />
      <rect
        x="160"
        y="200"
        width="80"
        height="80"
        rx="20"
        className="fill-bg stroke-line-strong"
      />
      <rect
        x="160"
        y="200"
        width="80"
        height="80"
        rx="20"
        fill="none"
        strokeWidth="1.25"
        className="core-ring stroke-accent"
      />
      <path d="M183 222h34v8h-13v28h-8v-28h-13Z" className="fill-fg" />
    </svg>
  );
}
