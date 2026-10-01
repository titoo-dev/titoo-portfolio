"use client";

import {
  Alignment,
  Fit,
  Layout,
  useRive,
  type ViewModelInstance,
} from "@rive-app/react-canvas";
import { useEffect } from "react";
import {
  type AvatarDriver,
  connectAvatar,
  emitAvatarEvent,
  type Mood,
} from "@/lib/avatar";

/**
 * The interactive avatar (public/avatar.riv). Host-side behaviour lives here:
 * theme colours, eyes following the cursor, the "?" -> "✓" beat synced with
 * the hero beams, a wave on arrival, dozing off when the page is idle, and
 * moods/reactions requested by the page through `data-avatar-*` attributes
 * or `lib/avatar`. In-canvas gestures (hover, poke, chip, laptop) are
 * listeners inside the .riv itself.
 */

const LAYOUT = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });
const BEAM_CYCLE = 4000; // `.beam` / `.core-ring` in globals.css
const BEAM_LAND = 0.4; // inbound beams reach the core
const IDLE_AFTER = 30_000;

const THEME: [prop: string, cssVar: string][] = [
  ["ink", "--fg"],
  ["inkSoft", "--muted"],
  ["inkFaint", "--line-strong"],
  ["paper", "--bg"],
];

function syncTheme(vmi: ViewModelInstance) {
  const style = getComputedStyle(document.documentElement);
  for (const [prop, cssVar] of THEME) {
    const hex = style.getPropertyValue(cssVar).trim().replace("#", "");
    const full =
      hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex.slice(0, 6);
    const rgb = Number.parseInt(full, 16);
    if (Number.isNaN(rgb)) continue;
    vmi.color(prop)?.argb(255, (rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255);
  }
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export default function RiveAvatar({ onReady }: { onReady: () => void }) {
  const { rive, canvas, RiveComponent } = useRive({
    src: "/avatar.riv",
    stateMachine: "Avatar",
    autoplay: true,
    autoBind: true,
    layout: LAYOUT,
  });

  useEffect(() => {
    const vmi = rive?.viewModelInstance;
    if (!rive || !vmi) return;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(
      type: K,
      fn: (e: WindowEventMap[K]) => void,
      target: Window | Document = window,
    ) => {
      target.addEventListener(type, fn as EventListener, { passive: true });
      cleanups.push(() =>
        target.removeEventListener(type, fn as EventListener),
      );
    };

    // --- driver -------------------------------------------------------------
    let base: Mood = "neutral"; // what the page asked for
    let shown: Mood = "neutral"; // what is on screen (may be transient)
    const show = (mood: Mood) => {
      shown = mood;
      const prop = vmi.enum("mood");
      if (prop) prop.value = mood;
    };
    // Codes unless asked not to; stops while dozing. (The .riv itself makes
    // him look up from the keyboard on hover and while talking.)
    let wantsTyping = true;
    let dozing = false;
    const applyTyping = () => {
      const prop = vmi.boolean("isTyping");
      if (prop) prop.value = wantsTyping && !dozing;
    };
    const humor = () => vmi.number("humor")?.value ?? 60;
    const driver: AvatarDriver = {
      setMood(mood) {
        base = mood;
        show(mood);
      },
      getMood: () => shown,
      setHumor(value) {
        const prop = vmi.number("humor");
        if (prop) prop.value = Math.max(0, Math.min(100, value));
      },
      getHumor: humor,
      fire: (trigger) => vmi.trigger(trigger)?.trigger(),
      setTalking(talking) {
        const prop = vmi.boolean("isTalking");
        if (prop) prop.value = talking;
      },
      setTyping(typing) {
        wantsTyping = typing;
        applyTyping();
      },
    };
    cleanups.push(connectAvatar(driver));
    applyTyping();

    // --- theme --------------------------------------------------------------
    syncTheme(vmi);
    const themeObserver = new MutationObserver(() => syncTheme(vmi));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => syncTheme(vmi);
    scheme.addEventListener("change", onScheme);
    cleanups.push(() => {
      themeObserver.disconnect();
      scheme.removeEventListener("change", onScheme);
    });

    // --- pokes: laughs until it gets old, then humor recovers ---------------
    // The .riv fires `poke` from its own click listener; observe the trigger.
    const poke = vmi.trigger("poke");
    const onPoke = () => {
      emitAvatarEvent({ type: "poke" });
      driver.setHumor(humor() - 18);
    };
    poke?.on(onPoke);
    const recover = setInterval(() => {
      if (humor() < 60) driver.setHumor(humor() + 6);
    }, 4000);
    cleanups.push(() => {
      poke?.off(onPoke);
      clearInterval(recover);
    });

    // --- eyes follow the cursor (eased) ------------------------------------
    const look = { x: 0, y: 0, tx: 0, ty: 0, raf: 0 };
    const lookX = vmi.number("lookX");
    const lookY = vmi.number("lookY");
    const step = () => {
      look.x += (look.tx - look.x) * 0.12;
      look.y += (look.ty - look.y) * 0.12;
      if (lookX) lookX.value = look.x;
      if (lookY) lookY.value = look.y;
      const settled =
        Math.abs(look.tx - look.x) < 0.002 &&
        Math.abs(look.ty - look.y) < 0.002;
      look.raf = settled ? 0 : requestAnimationFrame(step);
    };
    const aim = (x: number, y: number) => {
      look.tx = x;
      look.ty = y;
      if (!look.raf) look.raf = requestAnimationFrame(step);
    };
    cleanups.push(() => cancelAnimationFrame(look.raf));

    // --- idle: doze off, jolt awake -----------------------------------------
    let lastActive = Date.now();
    const wake = () => {
      lastActive = Date.now();
      if (!dozing) return;
      dozing = false;
      applyTyping();
      show("surprised");
      setTimeout(() => shown === "surprised" && show(base), 700);
    };
    const idleCheck = setInterval(() => {
      if (!dozing && Date.now() - lastActive > IDLE_AFTER) {
        dozing = true;
        applyTyping();
        show("sleepy");
        aim(0, 0.4);
      }
    }, 2000);
    cleanups.push(() => clearInterval(idleCheck));

    on("pointermove", (e) => {
      wake();
      const box = canvas?.getBoundingClientRect();
      if (!box) return;
      aim(
        clamp((e.clientX - (box.left + box.width / 2)) / (innerWidth * 0.35)),
        clamp((e.clientY - (box.top + box.height / 2)) / (innerHeight * 0.35)),
      );
    });
    on("keydown", wake);
    on("scroll", wake);
    on("pointerdown", wake);

    // --- the page asks for moods and reactions ------------------------------
    let hovered: Element | null = null;
    on(
      "pointerover",
      (e) => {
        const el = (e.target as Element | null)?.closest?.(
          "[data-avatar-mood]",
        );
        if (el === hovered) return;
        hovered = el ?? null;
        show((el?.getAttribute("data-avatar-mood") as Mood | null) ?? base);
      },
      document,
    );
    on(
      "click",
      (e) => {
        const el = (e.target as Element | null)?.closest?.(
          "[data-avatar-fire]",
        );
        const trigger = el?.getAttribute("data-avatar-fire");
        if (trigger)
          driver.fire(trigger as Parameters<AvatarDriver["fire"]>[0]);
      },
      document,
    );

    // --- "?" -> "✓" when the hero's inbound beams land ----------------------
    let beat: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const ring = document
        .getAnimations()
        .find((a) => (a as CSSAnimation).animationName === "core-ring");
      const now = Number(ring?.currentTime ?? performance.now());
      let wait = BEAM_LAND * BEAM_CYCLE - (now % BEAM_CYCLE);
      if (wait < 50) wait += BEAM_CYCLE;
      beat = setTimeout(() => {
        driver.fire("solve");
        schedule();
      }, wait);
    };
    schedule();
    cleanups.push(() => clearTimeout(beat));

    // --- say hello -----------------------------------------------------------
    const hello = setTimeout(() => driver.fire("wave"), 600);
    cleanups.push(() => clearTimeout(hello));

    onReady();
    return () => {
      for (const fn of cleanups) fn();
    };
  }, [rive, canvas, onReady]);

  return <RiveComponent className="size-full cursor-pointer" />;
}
