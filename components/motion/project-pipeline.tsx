/**
 * Terminal-style card that "ships" a project on a 9s loop: a command types
 * itself, each step spins then ticks, a progress rail fills the header edge
 * and the project goes live. Every element gets its own keyframes (built
 * below) so the whole sequence resets in sync. Base styles are the final
 * frame, so with reduced motion the finished pipeline is shown.
 */

const CYCLE = 9; // seconds
const FADE = "93% { opacity: 1 } 97%, 100% { opacity: 0 }";

const STEPS = [
  "Cadrage des besoins",
  "Conception UI/UX",
  "Développement",
  "Mise en production",
];

const stepAt = (i: number) => 10 + i * 12; // % of the cycle
const STATUS_AT = 60;

function appear(name: string, at: number) {
  return `@keyframes ${name} { 0%, ${at}% { opacity: 0; transform: translateY(3px) } ${at + 2}% { opacity: 1; transform: none } ${FADE} }`;
}

const css = [
  appear("pp-cmd", 1),
  `@keyframes pp-type { 0%, 2% { transform: scaleX(0) } 9%, 100% { transform: scaleX(1) } }`,
  `@keyframes pp-rail { 0%, 8% { stroke-dashoffset: 1; opacity: 1 } 57% { stroke-dashoffset: 0 } ${FADE} }`,
  ...STEPS.flatMap((_, i) => {
    const at = stepAt(i);
    return [
      appear(`pp-step-${i}`, at),
      `@keyframes pp-spin-${i} { 0%, ${at}% { opacity: 0 } ${at + 1}%, ${at + 8}% { opacity: 1 } ${at + 9}%, 100% { opacity: 0 } }`,
      `@keyframes pp-check-${i} { 0%, ${at + 8}% { stroke-dashoffset: 1; opacity: 1 } ${at + 11}% { stroke-dashoffset: 0 } ${FADE} }`,
    ];
  }),
  appear("pp-status", STATUS_AT),
  appear("pp-url", STATUS_AT + 2),
  `.pp { animation-duration: ${CYCLE}s; animation-iteration-count: infinite; animation-timing-function: ease-out; transform-box: fill-box; }`,
  `.pp-type { animation-name: pp-type; animation-timing-function: steps(18, end); transform-origin: left center; }`,
  `.pp-spinner { opacity: 0; }`,
  `.pp-spin { transform-box: fill-box; transform-origin: center; animation: spin 0.8s linear infinite; }`,
].join("\n");

const anim = (name: string) => ({ animationName: name });

export function ProjectPipeline() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="h-auto w-full max-w-[400px]"
      role="img"
      aria-label="Animation : un nouveau projet passe du cadrage des besoins à la mise en production, puis passe en ligne."
    >
      <style>{css}</style>
      <defs>
        <mask id="pp-type-mask">
          <rect
            x="60"
            y="96"
            width="200"
            height="20"
            fill="#fff"
            className="pp pp-type"
          />
        </mask>
        {/* userSpaceOnUse: a bounding-box gradient on a 0-height line paints nothing */}
        <linearGradient
          id="pp-rail-grad"
          gradientUnits="userSpaceOnUse"
          x1="20"
          y1="0"
          x2="380"
          y2="0"
        >
          <stop offset="0" style={{ stopColor: "var(--accent-2)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
      </defs>

      {/* Window */}
      <rect
        x="20.5"
        y="40.5"
        width="359"
        height="319"
        rx="12"
        className="fill-bg stroke-line-strong"
      />
      <g className="fill-line-strong">
        <circle cx="42" cy="58" r="4" />
        <circle cx="56" cy="58" r="4" />
        <circle cx="70" cy="58" r="4" />
      </g>
      <text
        x="200"
        y="62"
        textAnchor="middle"
        className="fill-faint font-mono text-[11px]"
      >
        ~/nouveau-projet
      </text>
      <line x1="20" y1="76.5" x2="380" y2="76.5" className="stroke-line" />
      <line
        x1="20"
        y1="76.5"
        x2="380"
        y2="76.5"
        stroke="url(#pp-rail-grad)"
        strokeWidth="1.5"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
        className="pp"
        style={anim("pp-rail")}
      />

      {/* Command */}
      <g className="pp font-mono text-[12.5px]" style={anim("pp-cmd")}>
        <text x="44" y="111" className="fill-faint">
          $
        </text>
        <text x="60" y="111" mask="url(#pp-type-mask)" className="fill-fg">
          npx lancer --ensemble
        </text>
      </g>

      {/* Steps */}
      {STEPS.map((label, i) => {
        const y = 150 + i * 34;
        const cy = y - 4.5;
        return (
          <g key={label}>
            <g className="pp pp-spinner" style={anim(`pp-spin-${i}`)}>
              <circle
                cx="46"
                cy={cy}
                r="5.5"
                fill="none"
                strokeWidth="1.5"
                strokeDasharray="22 13"
                strokeLinecap="round"
                className="pp-spin stroke-accent"
              />
            </g>
            <path
              d={`M41 ${cy} l3.5 3.5 l6.5 -7`}
              fill="none"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="0"
              className="pp stroke-success"
              style={anim(`pp-check-${i}`)}
            />
            <text
              x="62"
              y={y}
              className="pp fill-fg text-[13px]"
              style={anim(`pp-step-${i}`)}
            >
              {label}
            </text>
          </g>
        );
      })}

      <line x1="20" y1="282.5" x2="380" y2="282.5" className="stroke-line" />

      {/* Live */}
      <g className="pp" style={anim("pp-status")}>
        <circle cx="46" cy="317" r="4" className="pulse-ring fill-success" />
        <circle cx="46" cy="317" r="4" className="fill-success" />
        <text x="60" y="321.5" className="fill-fg font-medium text-[13px]">
          En ligne
        </text>
      </g>
      <text
        x="356"
        y="321.5"
        textAnchor="end"
        className="pp fill-muted font-mono text-[11.5px]"
        style={anim("pp-url")}
      >
        votre-projet.app ↗
      </text>
    </svg>
  );
}
