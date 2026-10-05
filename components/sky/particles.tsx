"use client";

import { useEffect, useRef } from "react";
import { fairWeather, type Scene } from "@/lib/sky";

/**
 * Canvas layer for everything that comes in numbers: rain, snow, and the
 * season's touch (spring petals, summer butterflies or fireflies, autumn
 * leaves). Pauses while the tab is hidden; draws a single still frame for
 * visitors who prefer reduced motion.
 */

type Kind =
  | "rain"
  | "drizzle"
  | "snow"
  | "petal"
  | "jacaranda"
  | "leaf"
  | "firefly"
  | "butterfly";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  spin: number;
  seed: number;
  color: string;
};

const LEAVES = ["#e0782f", "#c94f2a", "#e8a93a", "#b5652b"];
const PETALS = ["#f7a8c4", "#fbc4d6", "#f4b6cf"];
// Jacarandas bloom violet across the tropics (Antananarivo in October).
const JACARANDA = ["#9b7fe0", "#8a6bd6", "#b29cf0"];
const WINGS = ["#f59e0b", "#60a5fa", "#f472b6", "#a78bfa"];

function mixOf(
  condition: Scene["condition"],
  season: Scene["season"],
  night: boolean,
  cold: boolean,
  fair: boolean,
  tropical: boolean,
): [Kind, number][] {
  switch (condition) {
    case "storm":
      return [["rain", 260]];
    case "rain":
      return [["rain", 170]];
    case "drizzle":
      return [["drizzle", 90]];
    case "snow":
      return [["snow", 150]];
    case "fog":
      return [];
  }
  // The season shows in fair weather only, and mostly by day.
  if (!fair) return [];
  switch (season) {
    case "spring":
      return night ? [] : [[tropical ? "jacaranda" : "petal", 18]];
    case "summer":
      return night ? [["firefly", 28]] : [["butterfly", 5]];
    case "autumn":
      return night ? [] : [["leaf", 16]];
    case "winter":
      return cold ? [["snow", 40]] : [];
  }
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pickFrom = (list: string[]) => list[Math.floor(rand(0, list.length))];

function spawn(
  kind: Kind,
  w: number,
  h: number,
  wind: number,
  anywhere: boolean,
): Particle {
  const y = anywhere ? rand(0, h) : rand(-h * 0.25, -10);
  const base = {
    x: rand(0, w),
    y,
    rot: rand(0, Math.PI * 2),
    seed: rand(0, 1000),
    spin: 0,
    vx: 0,
  };
  // Rain slants with the wind, up to ~25°.
  const slant = Math.min(0.45, wind / 60);
  switch (kind) {
    case "rain": {
      const vy = rand(900, 1300);
      return {
        ...base,
        x: rand(-h * slant, w),
        vy,
        vx: vy * slant,
        size: rand(0.6, 1.4),
        color: "",
      };
    }
    case "drizzle": {
      const vy = rand(450, 650);
      return {
        ...base,
        x: rand(-h * slant, w),
        vy,
        vx: vy * slant,
        size: rand(0.4, 0.9),
        color: "",
      };
    }
    case "snow":
      return {
        ...base,
        vy: rand(25, 70),
        vx: wind * 0.6,
        size: rand(1, 3.6),
        color: "",
      };
    case "petal":
    case "jacaranda":
      return {
        ...base,
        vy: rand(22, 42),
        vx: rand(8, 22),
        size: rand(4, 6.5),
        spin: rand(-1.5, 1.5),
        color: pickFrom(kind === "petal" ? PETALS : JACARANDA),
      };
    case "leaf":
      return {
        ...base,
        vy: rand(32, 58),
        vx: rand(5, 18),
        size: rand(7, 11),
        spin: rand(-1.8, 1.8),
        color: LEAVES[Math.floor(rand(0, LEAVES.length))],
      };
    case "firefly":
      return {
        ...base,
        y: rand(h * 0.2, h),
        vy: 0,
        size: rand(1.6, 2.8),
        spin: rand(0.8, 2),
        color: "",
      };
    case "butterfly":
      return {
        ...base,
        y: rand(h * 0.15, h * 0.8),
        vy: 0,
        size: rand(5, 8),
        spin: rand(10, 14),
        color: WINGS[Math.floor(rand(0, WINGS.length))],
      };
  }
}

/** Soft glow sprite, drawn once and stamped for every firefly. */
function glowSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  if (!g) return c;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,246,150,1)");
  grad.addColorStop(0.25, "rgba(240,230,90,0.65)");
  grad.addColorStop(1, "rgba(220,230,80,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return c;
}

export function Particles({ scene, dark }: { scene: Scene; dark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { condition, season, wind } = scene;
  const night = scene.phase === "night";
  const cold = scene.temp !== null && scene.temp < 2 && !scene.tropical;
  const fair = fairWeather(scene);
  const { tropical } = scene;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const mix = mixOf(condition, season, night, cold, fair, tropical);
    if (mix.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Half as many on phones.
    const density = w < 640 ? 0.5 : 1;
    const groups = mix.map(([kind, count]) => ({
      kind,
      items: Array.from({ length: Math.round(count * density) }, () =>
        spawn(kind, w, h, wind, true),
      ),
    }));

    const rain = dark ? "174,196,228" : "84,108,140";
    const snow = dark ? "255,255,255" : "140,160,190";
    const glow = glowSprite();
    let t = 0;

    const step = (dt: number) => {
      t += dt;
      ctx.clearRect(0, 0, w, h);
      for (const { kind, items } of groups) {
        if (kind === "rain" || kind === "drizzle") {
          ctx.lineCap = "round";
          for (const p of items) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.y > h + 20) Object.assign(p, spawn(kind, w, h, wind, false));
            const len = kind === "rain" ? 0.022 : 0.016;
            ctx.strokeStyle = `rgba(${rain},${(kind === "rain" ? 0.32 : 0.22) * p.size})`;
            ctx.lineWidth = p.size * (kind === "rain" ? 1.2 : 0.9);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * len, p.y - p.vy * len);
            ctx.stroke();
          }
        } else if (kind === "snow") {
          for (const p of items) {
            p.y += p.vy * dt * (0.6 + p.size / 4);
            p.x += (p.vx + Math.sin(t * 0.9 + p.seed) * 18) * dt;
            if (p.y > h + 10) Object.assign(p, spawn(kind, w, h, wind, false));
            if (p.x > w + 10) p.x = -10;
            if (p.x < -10) p.x = w + 10;
            ctx.fillStyle = `rgba(${snow},${0.45 + p.size / 8})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (
          kind === "petal" ||
          kind === "jacaranda" ||
          kind === "leaf"
        ) {
          for (const p of items) {
            const sway = Math.sin(t * 1.1 + p.seed);
            p.y += p.vy * dt;
            p.x += (p.vx + sway * 28) * dt;
            p.rot += p.spin * dt;
            if (p.y > h + 20 || p.x > w + 30)
              Object.assign(p, spawn(kind, w, h, wind, false), {
                x: rand(-w * 0.3, w),
              });
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            // Tumbling: squash along x as the piece turns over.
            ctx.scale(0.3 + 0.7 * Math.abs(Math.cos(t * 1.7 + p.seed)), 1);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            if (kind !== "leaf") {
              ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
              ctx.fill();
            } else {
              const s = p.size;
              ctx.moveTo(0, -s);
              ctx.quadraticCurveTo(s * 0.8, -s * 0.2, 0, s);
              ctx.quadraticCurveTo(-s * 0.8, -s * 0.2, 0, -s);
              ctx.fill();
              ctx.strokeStyle = "rgba(90,40,10,0.45)";
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(0, -s * 0.9);
              ctx.lineTo(0, s * 1.25);
              ctx.stroke();
            }
            ctx.restore();
          }
          ctx.globalAlpha = 1;
        } else {
          // Fireflies and butterflies wander on a slowly turning heading.
          const speed = kind === "firefly" ? 14 : 46;
          for (const p of items) {
            p.rot +=
              Math.sin(t * 0.7 + p.seed) *
              dt *
              (kind === "firefly" ? 1.4 : 1.8);
            p.x += Math.cos(p.rot) * speed * dt;
            p.y += Math.sin(p.rot) * speed * dt * 0.6;
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < h * 0.1 || p.y > h) p.rot = -p.rot;
            if (kind === "firefly") {
              const pulse = 0.5 + 0.5 * Math.sin(t * p.spin + p.seed);
              ctx.globalAlpha = 0.15 + 0.85 * pulse;
              const s = p.size * 9;
              ctx.drawImage(glow, p.x - s / 2, p.y - s / 2, s, s);
            } else {
              const flap = Math.abs(Math.sin(t * p.spin + p.seed));
              ctx.save();
              ctx.translate(p.x, p.y + Math.sin(t * 3 + p.seed) * 3);
              ctx.rotate(Math.cos(p.rot) > 0 ? 0.25 : -0.25);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = 0.9;
              for (const side of [-1, 1]) {
                ctx.save();
                ctx.scale(side * (0.25 + 0.75 * flap), 1);
                ctx.beginPath();
                ctx.ellipse(
                  p.size * 0.6,
                  -p.size * 0.35,
                  p.size * 0.7,
                  p.size * 0.55,
                  -0.5,
                  0,
                  Math.PI * 2,
                );
                ctx.ellipse(
                  p.size * 0.45,
                  p.size * 0.35,
                  p.size * 0.45,
                  p.size * 0.38,
                  0.5,
                  0,
                  Math.PI * 2,
                );
                ctx.fill();
                ctx.restore();
              }
              ctx.fillStyle = dark ? "#e5e7eb" : "#374151";
              ctx.fillRect(-0.7, -p.size * 0.6, 1.4, p.size * 1.2);
              ctx.restore();
            }
          }
          ctx.globalAlpha = 1;
        }
      }
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      step(0);
      return;
    }

    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      step(Math.min(0.05, (now - last) / 1000));
      last = now;
      frame = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };
    frame = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [condition, season, night, cold, fair, tropical, wind, dark]);

  return (
    <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />
  );
}
