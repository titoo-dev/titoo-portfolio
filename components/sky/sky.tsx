"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyPreset,
  type Condition,
  fairWeather,
  moodOf,
  type Phase,
  PRESETS,
  type Preset,
  type Scene,
  type Season,
  sceneOf,
  sunUp,
  type Weather,
} from "@/lib/sky";
import { cn } from "@/lib/utils";
import { Particles } from "./particles";
import {
  type Bolt,
  Clouds,
  Flocks,
  FlyingOwl,
  Fog,
  Lightning,
  Moon,
  makeBolt,
  makeClouds,
  makeFlocks,
  makeStars,
  Overcast,
  Rainbow,
  SkyFilters,
  SkyIcon,
  Stars,
  Sun,
} from "./sky-art";

export type SkyLabels = {
  label: string;
  intro: string;
  presets: Record<Preset, string>;
  conditions: Record<Condition, string>;
  phases: Record<Phase, string>;
  seasons: Record<Season, string>;
  hide: string;
  show: string;
};

/** How much of the sun or moon shows through each kind of weather. */
const BODY_OPACITY: Record<Condition, number> = {
  clear: 1,
  partly: 1,
  cloudy: 0.35,
  fog: 0.3,
  drizzle: 0.3,
  rain: 0,
  storm: 0,
  snow: 0.3,
};

const STORAGE_KEY = "sky";
/** Last known sunrise/sunset, read by the pre-paint script in the layout. */
const SUN_KEY = "sky-sun";
const WEATHER_REFRESH = 30 * 60_000;

/** Dark when the visitor picked dark, or picked "auto" and the sun is down. */
function useDarkTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      const { theme, sky } = root.dataset;
      setDark(
        theme === "dark" ||
          (theme !== "light" && (sky ? sky === "night" : media.matches)),
      );
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme", "data-sky"],
    });
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);
  return dark;
}

/** Mirrors the scene on <html>: drives the automatic theme and the colors of
 *  the sky and the landscape. */
function useSceneAttributes(scene: Scene | null, off: boolean) {
  useEffect(() => {
    if (!scene) return;
    const d = document.documentElement.dataset;
    d.sky = sunUp(scene) ? "day" : "night";
    d.skyPhase = scene.phase;
    d.skyMood = moodOf(scene);
    d.skySeason = scene.season;
    d.skyFair = String(fairWeather(scene));
    d.skyTropical = String(scene.tropical);
    d.skySnow = String(
      scene.condition === "snow" ||
        (scene.season === "winter" && scene.temp !== null && scene.temp < 2),
    );
    if (off) d.skyOff = "";
    else delete d.skyOff;
  }, [scene, off]);
}

/**
 * Animated sky behind the whole site. It follows the real time of day and the
 * weather where the visitor is (see /api/weather): sun or moon on their arc,
 * clouds, birds, rain, snow, fog, lightning, owls at night, and the season.
 * In "auto" theme the site itself turns dark at night. Client-only: it renders
 * nothing until mounted.
 */
export function Sky({ labels }: { labels: SkyLabels }) {
  const [now, setNow] = useState<number | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [preset, setPreset] = useState<Preset>("live");
  const [off, setOff] = useState(false);
  const [small, setSmall] = useState(false);
  const dark = useDarkTheme();

  useEffect(() => {
    setNow(Date.now());
    setSmall(window.innerWidth < 640);
    try {
      setOff(localStorage.getItem(STORAGE_KEY) === "off");
    } catch {
      // Storage unavailable: keep the sky on.
    }
    const tick = setInterval(() => setNow(Date.now()), 60_000);

    let alive = true;
    const load = () =>
      fetch("/api/weather")
        .then((r) => (r.ok ? (r.json() as Promise<Weather>) : null))
        .then((w) => {
          if (!alive || !w) return;
          setWeather(w);
          try {
            localStorage.setItem(
              SUN_KEY,
              JSON.stringify({ r: w.sunrise, s: w.sunset }),
            );
          } catch {
            // Storage unavailable: the next visit guesses from the clock.
          }
        })
        .catch(() => {});
    load();
    const refresh = setInterval(load, WEATHER_REFRESH);
    return () => {
      alive = false;
      clearInterval(tick);
      clearInterval(refresh);
    };
  }, []);

  const live = useMemo(
    () => (now === null ? null : sceneOf(weather, now)),
    [weather, now],
  );
  const scene = useMemo(
    () => live && applyPreset(live, preset),
    [live, preset],
  );
  useSceneAttributes(scene, off);

  // Layers drift slightly against the pointer for a sense of depth (--px and
  // --py on <html>, read by .sky-layer).
  useEffect(() => {
    const root = document.documentElement;
    if (off || window.matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty(
          "--px",
          (e.clientX / window.innerWidth - 0.5).toFixed(3),
        );
        root.style.setProperty(
          "--py",
          (e.clientY / window.innerHeight - 0.5).toFixed(3),
        );
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [off]);

  if (!live || !scene) return null;

  function toggle() {
    const next = !off;
    setOff(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, "off");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable: the choice lasts for this visit.
    }
  }

  return (
    <>
      {!off && <SkyLayers scene={scene} dark={dark} small={small} />}
      <SkyChip
        live={live}
        scene={scene}
        preset={preset}
        onPreset={setPreset}
        off={off}
        onToggle={toggle}
        labels={labels}
      />
    </>
  );
}

const depth = (px: number) => ({ "--depth": `${px}px` }) as React.CSSProperties;

function SkyLayers({
  scene,
  dark,
  small,
}: {
  scene: Scene;
  dark: boolean;
  small: boolean;
}) {
  const { phase, condition, season, wind } = scene;
  const night = phase === "night";
  const twilight = phase === "dawn" || phase === "dusk";
  const mood = moodOf(scene);
  const wet = mood === "storm";

  const stars = useMemo(() => makeStars(small ? 70 : 160), [small]);
  const clouds = useMemo(
    () => makeClouds(condition, wind, small),
    [condition, wind, small],
  );
  const birdsOut =
    !night && !wet && condition !== "fog" && condition !== "snow";
  const geese = season === "autumn" || season === "winter";
  const flocks = useMemo(
    () => (birdsOut ? makeFlocks(small ? 2 : 3, geese) : []),
    [birdsOut, small, geese],
  );

  const bolt = useLightning(condition === "storm");
  const bodyOpacity = BODY_OPACITY[condition];
  const starOpacity = night
    ? mood === "clear"
      ? 1
      : 0.25
    : twilight && !sunUp(scene)
      ? 0.5
      : 0;

  return (
    <div aria-hidden className="sky">
      <SkyFilters />
      {starOpacity > 0 && (
        <div className="sky-layer" style={depth(6)}>
          <Stars
            stars={stars}
            opacity={starOpacity}
            milkyWay={night && mood === "clear" && dark}
          />
        </div>
      )}

      <div className="sky-layer" style={depth(10)}>
        {!night && bodyOpacity > 0 && (
          <Sun progress={scene.progress} opacity={bodyOpacity} />
        )}
        {night && bodyOpacity > 0 && (
          <Moon
            progress={scene.progress}
            age={scene.moon}
            southern={scene.southern}
            opacity={bodyOpacity}
          />
        )}
        {phase === "day" && condition === "drizzle" && <Rainbow />}
      </div>

      <div className="sky-layer" style={depth(18)}>
        {mood !== "clear" && <Overcast />}
        <Clouds clouds={clouds} />
        <Flocks flocks={flocks} />
        {night && !wet && <FlyingOwl top="20vh" />}
      </div>

      {condition === "fog" && <Fog />}
      <Particles scene={scene} dark={dark} />
      {bolt && <Lightning bolt={bolt} />}
    </div>
  );
}

/** A new bolt every 4-11 s while `active`. */
function useLightning(active: boolean) {
  const [bolt, setBolt] = useState<Bolt | null>(null);
  useEffect(() => {
    if (
      !active ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setBolt(null);
      return;
    }
    let id = 0;
    let timer: ReturnType<typeof setTimeout>;
    const strike = () => {
      id += 1;
      setBolt(makeBolt(id));
      timer = setTimeout(strike, 4000 + Math.random() * 7000);
    };
    timer = setTimeout(strike, 1500);
    return () => clearTimeout(timer);
  }, [active]);
  return bolt;
}

function SkyChip({
  live,
  scene,
  preset,
  onPreset,
  off,
  onToggle,
  labels,
}: {
  live: Scene;
  scene: Scene;
  preset: Preset;
  onPreset: (p: Preset) => void;
  off: boolean;
  onToggle: () => void;
  labels: SkyLabels;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const summary = [
    live.temp !== null && `${live.temp}°`,
    labels.conditions[live.condition],
    live.city,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div ref={boxRef} className="fixed right-4 bottom-4 z-40 font-mono text-xs">
      {open && (
        <div
          id="sky-panel"
          className="sky-panel absolute right-0 bottom-full mb-2 w-64 rounded-2xl border border-line bg-bg/90 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
        >
          <p className="text-fg">{summary}</p>
          <p className="mt-1 text-faint">
            {labels.phases[live.phase]} · {labels.seasons[live.season]}
          </p>
          <p className="mt-2 font-sans text-muted leading-relaxed">
            {labels.intro}
          </p>
          <fieldset className="mt-3 flex flex-wrap gap-1.5" disabled={off}>
            <legend className="sr-only">{labels.label}</legend>
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={preset === p}
                onClick={() => onPreset(p)}
                className={cn(
                  "rounded-full border border-line px-2.5 py-1 text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-40",
                  preset === p && "border-line-strong bg-subtle text-fg",
                )}
              >
                {labels.presets[p]}
              </button>
            ))}
          </fieldset>
          <button
            type="button"
            onClick={onToggle}
            className="mt-3 w-full rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            {off ? labels.show : labels.hide}
          </button>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="sky-panel"
        aria-label={`${labels.label}: ${summary}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-2 rounded-full border border-line bg-bg/80 px-3 text-muted backdrop-blur-md transition-colors hover:border-line-strong hover:text-fg"
      >
        <SkyIcon scene={scene} />
        {live.temp !== null && <span>{live.temp}°</span>}
        {preset !== "live" && (
          <span className="rounded-full bg-subtle px-1.5 text-fg">
            {labels.presets[preset]}
          </span>
        )}
      </button>
    </div>
  );
}
