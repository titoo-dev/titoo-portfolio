import { type CSSProperties, useId } from "react";
import type { Condition, Scene } from "@/lib/sky";

/**
 * Illustrated pieces of the background sky. Motion is CSS (see "Sky" in
 * globals.css) plus SMIL for wing flaps. Clouds, the Milky Way and the moon's
 * surface get their texture from the SVG noise filters in <SkyFilters>.
 * Colors come from the `--sky-*`-style tokens set on <html>, so every piece
 * follows the theme, the time of day and the weather.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Where the sun or moon sits along its arc, in viewport units. */
function arc(progress: number) {
  const p = Math.min(1.08, Math.max(-0.08, progress));
  return {
    left: `${8 + 84 * p}vw`,
    top: `${44 - 32 * Math.sin(Math.PI * p)}vh`,
  };
}

// ---------------------------------------------------------------------------
// Noise filters
// ---------------------------------------------------------------------------

/** Fractal noise pushes the edges of plain ellipses into cloud shapes. */
function CloudFilter({
  id,
  seed,
  frequency,
  scale,
}: {
  id: string;
  seed: number;
  frequency: string;
  scale: number;
}) {
  return (
    <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={frequency}
        numOctaves="5"
        seed={seed}
      />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
  );
}

export function SkyFilters() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <CloudFilter id="sky-cloud-0" seed={3} frequency="0.012" scale={90} />
      <CloudFilter id="sky-cloud-1" seed={11} frequency="0.016" scale={70} />
      <CloudFilter id="sky-cloud-2" seed={27} frequency="0.02" scale={55} />
      <CloudFilter
        id="sky-cloud-wisp"
        seed={5}
        frequency="0.004 0.04"
        scale={60}
      />
      <CloudFilter
        id="sky-overcast"
        seed={9}
        frequency="0.006 0.012"
        scale={140}
      />
      <filter id="sky-milky" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.02"
          numOctaves="4"
          seed="2"
        />
        <feDisplacementMap in="SourceGraphic" scale="120" />
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sun and moon
// ---------------------------------------------------------------------------

export function Sun({
  progress,
  opacity,
}: {
  progress: number;
  opacity: number;
}) {
  return (
    <div className="sky-body sky-sun" style={{ ...arc(progress), opacity }}>
      <div className="sun-halo" />
      <div className="sun-beams" />
      <div className="sun-core" />
    </div>
  );
}

/** Lit part of the moon for a lunar age (0 new, 0.5 full), lit side right. */
function moonPath(age: number, r: number) {
  const waxing = age < 0.5;
  const crescent = age < 0.25 || age > 0.75;
  const rx = r * Math.abs(Math.cos(age * 2 * Math.PI));
  const outer = waxing ? 1 : 0;
  const terminator = waxing === crescent ? 0 : 1;
  return `M0 ${-r}A${r} ${r} 0 0 ${outer} 0 ${r}A${rx.toFixed(2)} ${r} 0 0 ${terminator} 0 ${-r}Z`;
}

// Lunar seas, roughly where they sit on the near side: [cx, cy, rx, ry].
const MARIA = [
  [-13, -13, 12, 9],
  [5, -15, 7, 6],
  [12, -4, 8, 7],
  [21, 6, 5, 7],
  [27, -11, 4, 3.5],
  [-22, 3, 9, 15],
  [-6, 15, 8, 6],
  [-14, 22, 5, 4],
];

export function Moon({
  progress,
  age,
  southern,
  opacity,
}: {
  progress: number;
  age: number;
  southern: boolean;
  opacity: number;
}) {
  const r = 40;
  // Unique ids: two moons share the screen while the sky turns.
  const uid = `moon${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const illumination = (1 - Math.cos(age * 2 * Math.PI)) / 2;
  return (
    <div className="sky-body sky-moon" style={{ ...arc(progress), opacity }}>
      <div
        className="moon-halo"
        style={{ opacity: 0.3 + 0.7 * illumination }}
      />
      <svg
        aria-hidden="true"
        viewBox="-50 -50 100 100"
        className="relative size-full"
      >
        <defs>
          <radialGradient id={`${uid}-face`} cx="0.42" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#fbfaf3" />
            <stop offset="0.7" stopColor="#e4e1d6" />
            <stop offset="1" stopColor="#c9c5b8" />
          </radialGradient>
          <filter
            id={`${uid}-soft`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter
            id={`${uid}-seas`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id={`${uid}-grain`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.35"
              numOctaves="3"
              seed="4"
            />
            <feColorMatrix values="0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.47 0 0 0 0.9 -0.35" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          {/* A blurred lit shape softens the terminator, like the real one. */}
          <mask id={`${uid}-lit`}>
            <path
              d={moonPath(age, r)}
              fill="#fff"
              filter={`url(#${uid}-soft)`}
            />
          </mask>
        </defs>
        {/* The south sees the moon upside down. */}
        <g transform={southern ? "rotate(180)" : undefined}>
          <circle r={r} fill="var(--moon-dark)" />
          <g mask={`url(#${uid}-lit)`}>
            <circle r={r} fill={`url(#${uid}-face)`} />
            <g fill="#7d7f86" opacity="0.55" filter={`url(#${uid}-seas)`}>
              {MARIA.map(([cx, cy, rx, ry]) => (
                <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
              ))}
            </g>
            <circle r={r} fill="#fff" filter={`url(#${uid}-grain)`} />
            <circle cx="-5" cy="30" r="1.6" fill="#fff" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stars
// ---------------------------------------------------------------------------

export type Star = { x: number; y: number; size: number; vars: Vars };

// Real stars run from blue-white to orange.
const STAR_TINTS = ["#ffffff", "#cfe0ff", "#fff3dc", "#ffe1c2", "#dfe7ff"];

export function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
    const size = Math.random() < 0.08 ? rand(2.4, 3.4) : rand(0.8, 2);
    return {
      x: rand(0, 100),
      // Denser high in the sky.
      y: 80 * Math.random() ** 1.3,
      size,
      vars: {
        "--d": `${rand(2.2, 6).toFixed(2)}s`,
        "--delay": `${-rand(0, 6).toFixed(2)}s`,
        "--tint": STAR_TINTS[Math.floor(rand(0, STAR_TINTS.length))],
      },
    };
  });
}

export function Stars({
  stars,
  opacity,
  milkyWay,
}: {
  stars: Star[];
  opacity: number;
  milkyWay: boolean;
}) {
  return (
    <div className="sky-fade absolute inset-0" style={{ opacity }}>
      {milkyWay && <div className="sky-milkyway" />}
      {stars.map((s) => (
        <span
          key={`${s.x}-${s.y}`}
          className={s.size > 2.3 ? "sky-star sky-star-bright" : "sky-star"}
          style={{
            ...s.vars,
            left: `${s.x}vw`,
            top: `${s.y}vh`,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
      <span className="shooting-star" style={{ left: "72vw", top: "6vh" }} />
      <span
        className="shooting-star"
        style={{
          left: "38vw",
          top: "14vh",
          animationDuration: "19s",
          animationDelay: "7s",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clouds
// ---------------------------------------------------------------------------

export type CloudSpec = {
  id: number;
  wisp: boolean;
  width: number;
  filters: [string, string, string];
  vars: Vars;
};

/** Cumulus count and high wisps for each kind of weather. */
const CLOUD_MIX: Record<Condition, [cumulus: number, wisps: number]> = {
  clear: [0, 3],
  partly: [4, 2],
  cloudy: [8, 0],
  fog: [4, 0],
  drizzle: [7, 0],
  rain: [9, 0],
  storm: [10, 0],
  snow: [7, 0],
};

export function makeClouds(
  condition: Condition,
  wind: number,
  small: boolean,
): CloudSpec[] {
  const [cumulus, wisps] = CLOUD_MIX[condition];
  const scale = small ? 0.6 : 1;
  const total = Math.ceil(cumulus * scale) + wisps;
  // Clouds cross the screen faster on windy days.
  const pace = 1 / (1 + wind / 25);
  return Array.from({ length: total }, (_, id) => {
    const wisp = id >= total - wisps;
    const dur = rand(110, 200) * pace * (wisp ? 1.6 : 1);
    const f = id % 3;
    return {
      id,
      wisp,
      width: (wisp ? rand(320, 560) : rand(260, 480)) * (small ? 0.7 : 1),
      filters: wisp
        ? ["sky-cloud-wisp", "sky-cloud-wisp", "sky-cloud-wisp"]
        : [
            `sky-cloud-${f}`,
            `sky-cloud-${(f + 1) % 3}`,
            `sky-cloud-${(f + 2) % 3}`,
          ],
      vars: {
        "--dur": `${dur.toFixed(1)}s`,
        "--delay": `${((-dur * (id + Math.random())) / total).toFixed(1)}s`,
        "--x": `${rand(-10, 90).toFixed(1)}vw`,
        top: `${(wisp ? rand(2, 18) : rand(-2, 40)).toFixed(1)}vh`,
        opacity: (wisp ? rand(0.5, 0.75) : rand(0.85, 1)).toFixed(2),
      },
    };
  });
}

export function Clouds({ clouds }: { clouds: CloudSpec[] }) {
  return (
    <>
      {clouds.map((c) => (
        <div
          key={c.id}
          className="sky-cloud"
          data-wisp={c.wisp || undefined}
          style={{ ...c.vars, width: c.width }}
        >
          <div
            className="sky-puff"
            data-part="base"
            style={{ filter: `url(#${c.filters[0]})` }}
          />
          {!c.wisp && (
            <>
              <div
                className="sky-puff"
                data-part="shade"
                style={{ filter: `url(#${c.filters[1]})` }}
              />
              <div
                className="sky-puff"
                data-part="light"
                style={{ filter: `url(#${c.filters[2]})` }}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
}

/** Low grey ceiling for overcast and wet weather. */
export function Overcast() {
  return <div className="sky-overcast" />;
}

// ---------------------------------------------------------------------------
// Birds
// ---------------------------------------------------------------------------

// Same commands in both poses so SMIL can morph between them.
const WINGS_UP =
  "M0 0C-4-2-8-8-13-10C-10-5-6-1 0 2C6-1 10-5 13-10C8-8 4-2 0 0Z";
const WINGS_DOWN =
  "M0 0C-4 1-8 4-13 7C-10 5-6 3 0 2C6 3 10 5 13 7C8 4 4 1 0 0Z";

function Bird({
  x,
  y,
  scale,
  flap,
}: {
  x: number;
  y: number;
  scale: number;
  flap: number;
}) {
  return (
    <path
      d={WINGS_UP}
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="currentColor"
    >
      <animate
        attributeName="d"
        dur={`${flap}s`}
        repeatCount="indefinite"
        values={`${WINGS_UP};${WINGS_DOWN};${WINGS_UP}`}
        calcMode="spline"
        keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
      />
    </path>
  );
}

export type FlockSpec = {
  id: number;
  rtl: boolean;
  width: number;
  vars: Vars;
  birds: { x: number; y: number; scale: number; flap: number }[];
};

/** A loose group, or a V when `geese`. */
export function makeFlocks(count: number, geese: boolean): FlockSpec[] {
  return Array.from({ length: count }, (_, id) => {
    const size = geese ? 7 : Math.floor(rand(2, 6));
    const birds = Array.from({ length: size }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      const rank = Math.ceil(i / 2);
      return geese
        ? {
            x: 90 - rank * 14,
            y: 30 + side * rank * 8,
            scale: 0.75,
            flap: rand(0.75, 0.9),
          }
        : {
            x: rand(12, 110),
            y: rand(10, 50),
            scale: rand(0.5, 0.85),
            flap: rand(0.35, 0.55),
          };
    });
    const dur = rand(36, 56);
    return {
      id,
      rtl: Math.random() < 0.4,
      width: geese ? 140 : rand(90, 130),
      birds,
      vars: {
        "--dur": `${dur.toFixed(1)}s`,
        "--delay": `${(-dur * Math.random()).toFixed(1)}s`,
        top: `${rand(10, 42).toFixed(1)}vh`,
      },
    };
  });
}

export function Flocks({ flocks }: { flocks: FlockSpec[] }) {
  return (
    <>
      {flocks.map((f) => (
        <div
          key={f.id}
          className="sky-flock"
          data-dir={f.rtl ? "rtl" : "ltr"}
          style={{ ...f.vars, width: f.width }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 120 60"
            overflow="visible"
            className="sky-flock-bob block h-auto w-full"
            style={f.rtl ? { scale: "-1 1" } : undefined}
          >
            {f.birds.map((b) => (
              <Bird key={`${b.x}-${b.y}`} {...b} />
            ))}
          </svg>
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Owls
// ---------------------------------------------------------------------------

/** Perched owl drawn around (0, 0), feet at y = 42. Blinks, looks around. */
export function OwlFigure() {
  return (
    <g>
      <path
        d="M-22 4C-26 22 -18 40 0 42C18 40 26 22 22 4Z"
        fill="var(--owl-wing)"
      />
      <ellipse cx="0" cy="12" rx="22" ry="29" fill="var(--owl)" />
      <ellipse cx="0" cy="19" rx="14" ry="19" fill="var(--owl-belly)" />
      <g
        fill="none"
        stroke="var(--owl-wing)"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.6"
      >
        <path d="M-7 10l2 2l2 -2M3 10l2 2l2 -2M-2 18l2 2l2 -2M-8 25l2 2l2 -2M4 25l2 2l2 -2M-2 32l2 2l2 -2" />
      </g>
      <path
        d="M-21 8C-27 20 -24 32 -14 38C-18 28 -19 18 -21 8Z"
        fill="var(--owl-wing)"
      />
      <path
        d="M21 8C27 20 24 32 14 38C18 28 19 18 21 8Z"
        fill="var(--owl-wing)"
      />
      <g stroke="var(--owl-beak)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M-8 38v5M-11 39l-1 4M-5 39l1 4" />
        <path d="M8 38v5M5 39l-1 4M11 39l1 4" />
      </g>
      <g className="sky-owl-head">
        <path d="M-20 -26L-23 -44L-9 -33Z" fill="var(--owl)" />
        <path d="M20 -26L23 -44L9 -33Z" fill="var(--owl)" />
        <ellipse cx="0" cy="-20" rx="23" ry="18.5" fill="var(--owl)" />
        <circle cx="-10" cy="-20" r="10.5" fill="var(--owl-face)" />
        <circle cx="10" cy="-20" r="10.5" fill="var(--owl-face)" />
        <circle cx="-10" cy="-20" r="7" fill="var(--owl-eye)" />
        <circle cx="10" cy="-20" r="7" fill="var(--owl-eye)" />
        <g className="sky-owl-pupils" fill="#1b1b1f">
          <circle cx="-10" cy="-20" r="3.8" />
          <circle cx="10" cy="-20" r="3.8" />
          <circle cx="-8.6" cy="-21.6" r="1.2" fill="#fff" />
          <circle cx="11.4" cy="-21.6" r="1.2" fill="#fff" />
        </g>
        <g className="sky-owl-lids" fill="var(--owl)">
          <circle cx="-10" cy="-20" r="7.6" />
          <circle cx="10" cy="-20" r="7.6" />
        </g>
        <path d="M-3 -15L3 -15L0 -8Z" fill="var(--owl-beak)" />
      </g>
    </g>
  );
}

const OWL_WINGS_UP =
  "M0-2C-8-6-16-14-28-12C-20-6-10 0 0 3C10 0 20-6 28-12C16-14 8-6 0-2Z";
const OWL_WINGS_DOWN =
  "M0-2C-8 0-16 6-28 10C-20 8-10 5 0 3C10 5 20 8 28 10C16 6 8 0 0-2Z";

/** Silhouette crossing the night sky now and then. */
export function FlyingOwl({ top }: { top: string }) {
  return (
    <div className="sky-flyer" style={{ top }}>
      <svg
        aria-hidden="true"
        viewBox="-30 -18 60 32"
        className="block h-auto w-full"
        fill="var(--silhouette)"
      >
        <path d={OWL_WINGS_UP}>
          <animate
            attributeName="d"
            dur="0.9s"
            repeatCount="indefinite"
            values={`${OWL_WINGS_UP};${OWL_WINGS_DOWN};${OWL_WINGS_UP}`}
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
        </path>
        <ellipse cx="0" cy="1" rx="5.5" ry="7.5" />
        <path d="M-4.5-5L-5.5-10L-1.5-7ZM4.5-5L5.5-10L1.5-7Z" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fog, rainbow, lightning
// ---------------------------------------------------------------------------

export function Fog() {
  return (
    <div className="sky-fade absolute inset-0">
      <div className="sky-fog" style={{ top: "4vh" }} />
      <div
        className="sky-fog"
        style={{
          top: "26vh",
          animationDuration: "55s",
          animationDelay: "-20s",
        }}
      />
      <div
        className="sky-fog"
        style={{
          top: "52vh",
          animationDuration: "70s",
          animationDelay: "-35s",
        }}
      />
    </div>
  );
}

const RAINBOW = [
  "#ff5e5e",
  "#ffa53d",
  "#ffe14d",
  "#5fd36a",
  "#4aa8ff",
  "#8a6cff",
];

export function Rainbow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 210" className="sky-rainbow">
      {RAINBOW.map((color, i) => {
        const r = 190 - i * 7;
        return (
          <path
            key={color}
            d={`M${200 - r} 210A${r} ${r} 0 0 1 ${200 + r} 210`}
            fill="none"
            stroke={color}
            strokeWidth="7"
          />
        );
      })}
    </svg>
  );
}

export type Bolt = { id: number; x: number; points: string };

export function makeBolt(id: number): Bolt {
  let x = 0;
  let y = 0;
  const points = ["0,0"];
  while (y < 300) {
    x += rand(-26, 26);
    y += rand(18, 40);
    points.push(`${x.toFixed(0)},${y.toFixed(0)}`);
  }
  return { id, x: rand(10, 90), points: points.join(" ") };
}

export function Lightning({ bolt }: { bolt: Bolt }) {
  return (
    <div key={bolt.id} className="absolute inset-0">
      <div className="sky-flash" />
      <svg
        aria-hidden="true"
        viewBox="-80 0 160 320"
        className="sky-bolt"
        style={{ left: `${bolt.x}vw` }}
      >
        <polyline
          points={bolt.points}
          fill="none"
          stroke="var(--bolt)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chip icons
// ---------------------------------------------------------------------------

const ICONS: Record<string, string> = {
  sun: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z",
  cloud: "M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 11a3.5 3.5 0 0 0 1 7Z",
  rain: "M7 15h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8a3.5 3.5 0 0 0 1 7ZM8 18l-1 3M12 18l-1 3M16 18l-1 3",
  storm:
    "M7 14h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 7a3.5 3.5 0 0 0 1 7ZM12 14l-2 4h4l-2 4",
  snow: "M7 14h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 7a3.5 3.5 0 0 0 1 7ZM8 18v.1M12 20v.1M16 18v.1M10 22v.1M14 22v.1",
  fog: "M4 9h16M6 13h12M4 17h16",
};

export function SkyIcon({
  scene,
}: {
  scene: Pick<Scene, "phase" | "condition">;
}) {
  const { phase, condition } = scene;
  const name =
    condition === "rain" || condition === "drizzle"
      ? "rain"
      : condition === "storm" || condition === "snow" || condition === "fog"
        ? condition
        : condition === "cloudy"
          ? "cloud"
          : phase === "night"
            ? "moon"
            : "sun";
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
