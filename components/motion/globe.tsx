"use client";

import { useEffect, useRef } from "react";

/**
 * Wireframe globe in orthographic projection that sways gently around
 * Africa. Great-circle arcs link Antananarivo to countries of past clients;
 * a comet runs along each (CSS `.arc-beam`). Geometry is recomputed per
 * frame straight into the DOM, and only while the globe is on screen.
 */

const SIZE = 400;
const R = 160;
const C = SIZE / 2;
const TILT = 12 * (Math.PI / 180); // view latitude

type City = { name: string; lat: number; lon: number };

const HOME: City = { name: "Antananarivo", lat: -18.88, lon: 47.51 };
const LINKS: City[] = [
  { name: "France", lat: 48.86, lon: 2.35 },
  { name: "Gabon", lat: 0.39, lon: 9.45 },
];

const rad = (d: number) => d * (Math.PI / 180);

/** Projects lat/lon (degrees) at altitude `h` (fraction of R). */
function project(lat: number, lon: number, lon0: number, h = 0) {
  const phi = rad(lat);
  const dl = rad(lon) - lon0;
  const r = R * (1 + h);
  const cosc =
    Math.sin(TILT) * Math.sin(phi) +
    Math.cos(TILT) * Math.cos(phi) * Math.cos(dl);
  return {
    x: C + r * Math.cos(phi) * Math.sin(dl),
    y:
      C -
      r *
        (Math.cos(TILT) * Math.sin(phi) -
          Math.sin(TILT) * Math.cos(phi) * Math.cos(dl)),
    visible: cosc > 0,
  };
}

function line(points: { lat: number; lon: number }[], lon0: number) {
  let d = "";
  let pen = false;
  for (const p of points) {
    const q = project(p.lat, p.lon, lon0);
    if (!q.visible) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    pen = true;
  }
  return d;
}

const range = (a: number, b: number, step: number) => {
  const out: number[] = [];
  for (let v = a; v <= b; v += step) out.push(v);
  return out;
};

const PARALLELS = range(-60, 60, 20).map((lat) =>
  range(-180, 180, 4).map((lon) => ({ lat, lon })),
);
const MERIDIANS = range(-180, 160, 20).map((lon) =>
  range(-90, 90, 4).map((lat) => ({ lat, lon })),
);

function toVec({ lat, lon }: { lat: number; lon: number }) {
  const p = rad(lat);
  const l = rad(lon);
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

/** Great-circle samples from a to b, as lat/lon + altitude bulge. */
function arcSamples(a: City, b: City, n = 48) {
  const va = toVec(a);
  const vb = toVec(b);
  const omega = Math.acos(va.reduce((s, v, i) => s + v * vb[i], 0));
  return range(0, n, 1).map((i) => {
    const t = i / n;
    const k1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const k2 = Math.sin(t * omega) / Math.sin(omega);
    const [x, y, z] = va.map((v, j) => k1 * v + k2 * vb[j]);
    return {
      lat: (Math.asin(z) * 180) / Math.PI,
      lon: (Math.atan2(y, x) * 180) / Math.PI,
      h: 0.22 * omega * Math.sin(Math.PI * t),
    };
  });
}

const ARCS = LINKS.map((city) => arcSamples(HOME, city));

function arcPath(samples: ReturnType<typeof arcSamples>, lon0: number) {
  return samples
    .map((s, i) => {
      const q = project(s.lat, s.lon, lon0, s.h);
      return `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    })
    .join("");
}

const BASE_LON = rad(22);
const SWAY = rad(16);

export function Globe() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const grid = svg.querySelectorAll<SVGPathElement>("[data-grid]");
    const arcs = svg.querySelectorAll<SVGPathElement>("[data-arc]");
    const dots = svg.querySelectorAll<SVGGElement>("[data-city]");
    const cities = [HOME, ...LINKS];
    const lines = [...PARALLELS, ...MERIDIANS];

    const render = (lon0: number) => {
      lines.forEach((pts, i) => {
        grid[i]?.setAttribute("d", line(pts, lon0));
      });
      arcs.forEach((el) => {
        const i = Number(el.dataset.arc);
        el.setAttribute("d", arcPath(ARCS[i], lon0));
      });
      dots.forEach((el, i) => {
        const c = cities[i];
        const q = project(c.lat, c.lon, lon0);
        el.setAttribute("transform", `translate(${q.x} ${q.y})`);
        el.style.opacity = q.visible ? "1" : "0";
      });
    };

    render(BASE_LON);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start = 0;
    const loop = (t: number) => {
      if (!start) start = t;
      render(BASE_LON + SWAY * Math.sin((t - start) / 5200));
      frame = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(loop);
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const initial = BASE_LON;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full max-w-[400px]"
      role="img"
      aria-label="Globe : Antananarivo relié à la France et au Gabon."
    >
      <defs>
        <radialGradient id="globe-fill" cx="0.4" cy="0.35">
          <stop offset="0" style={{ stopColor: "var(--bg-subtle)" }} />
          <stop offset="1" style={{ stopColor: "var(--bg)" }} />
        </radialGradient>
        <linearGradient id="arc-grad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-2)" }} />
        </linearGradient>
      </defs>

      {/* Orbit ring */}
      <circle
        cx={C}
        cy={C}
        r={R + 26}
        fill="none"
        strokeDasharray="2 6"
        className="spin-slow stroke-line-strong"
      />

      <circle
        cx={C}
        cy={C}
        r={R}
        fill="url(#globe-fill)"
        className="stroke-line-strong"
      />

      <g fill="none" strokeWidth="0.75" className="stroke-line-strong">
        {[...PARALLELS, ...MERIDIANS].map((pts, i) => (
          <path
            // biome-ignore lint/suspicious/noArrayIndexKey: static graticule
            key={i}
            data-grid
            d={line(pts, initial)}
          />
        ))}
      </g>

      <g fill="none" strokeLinecap="round">
        {ARCS.map((samples, i) => (
          <g key={LINKS[i].name}>
            <path
              data-arc={i}
              d={arcPath(samples, initial)}
              strokeWidth="1"
              strokeDasharray="3 3"
              className="stroke-faint"
            />
            <path
              data-arc={i}
              d={arcPath(samples, initial)}
              pathLength={100}
              strokeWidth="2"
              stroke="url(#arc-grad)"
              className="arc-beam"
              style={{ animationDelay: `${i * 0.9}s` }}
            />
          </g>
        ))}
      </g>

      {[HOME, ...LINKS].map((c, i) => {
        const q = project(c.lat, c.lon, initial);
        const home = i === 0;
        return (
          <g
            key={c.name}
            data-city
            transform={`translate(${q.x} ${q.y})`}
            className="transition-opacity"
          >
            {home && <circle r="4" className="pulse-ring fill-accent" />}
            <circle
              r={home ? 4 : 2.75}
              strokeWidth="1.5"
              className={home ? "fill-accent stroke-bg" : "fill-fg stroke-bg"}
            />
            <text
              x={home ? 9 : -7}
              y={home ? 14 : -6}
              textAnchor={home ? "start" : "end"}
              className={
                home
                  ? "fill-fg font-mono text-[10.5px]"
                  : "fill-muted font-mono text-[9.5px]"
              }
            >
              {c.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
