"use client";

import {
  Alignment,
  Fit,
  Layout,
  useRive,
  type ViewModelInstance,
} from "@rive-app/react-canvas";
import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type AvatarDriver,
  connectAvatar,
  emitAvatarEvent,
  type Mood,
} from "@/lib/avatar";

/**
 * The interactive avatar (public/avatar.riv) and its thought bubble: two
 * artboards of one file on two canvases, since the bubble needs room above
 * the avatar's box to be legible. Host-side behaviour lives here: theme
 * colours, eyes following the cursor, the "?" -> "✓" beat synced with the
 * hero beams, a wave on arrival, thoughts typed into the bubble now and then,
 * replies in it when the visitor clicks, double-clicks or drags him,
 * dozing off when the page is idle, and moods/reactions requested by the page
 * through `data-avatar-*` attributes or `lib/avatar`. In-canvas gestures
 * (hover, poke, chip, laptop) are listeners inside the .riv itself.
 */

/** A thought for the bubble: up to 3 lines of ~28 characters. */
export type Thought = { text: string; code?: boolean };

/** What the visitor did to him; each has a few lines he may answer with. */
export type Reply =
  | "poke"
  | "pokeTired"
  | "double"
  | "drag"
  | "chip"
  | "laptop"
  | "other";
export type Replies = Record<Reply, string[]>;

// Each canvas loads it on its own (the browser caches it): a RiveFile shared
// through useRiveFile gets destroyed under React strict mode remounts.
export const SRC = "/avatar.riv";
export const LAYOUT = new Layout({
  fit: Fit.Contain,
  alignment: Alignment.Center,
});
const BEAM_CYCLE = 4000; // `.beam` / `.core-ring` in globals.css
const BEAM_LAND = 0.4; // inbound beams reach the core
const IDLE_AFTER = 30_000;
const FIRST_THOUGHT = 5000; // after the wave
const THOUGHT_GAP = [8000, 14_000];
export const TYPE_MS = { idea: 32, code: 42, reply: 24 };
const ARTBOARD = 120; // the avatar artboard's size, for pointer hit zones
const DOUBLE_CLICK_MS = 280;
const DRAG_PX = 24;

const THEME: [prop: string, cssVar: string][] = [
  ["ink", "--fg"],
  ["inkSoft", "--muted"],
  ["inkFaint", "--line-strong"],
  ["paper", "--bg"],
];

/** Keeps an artboard's ink colours on the site theme; returns a cleanup. */
export function watchTheme(vmi: ViewModelInstance) {
  syncTheme(vmi);
  const observer = new MutationObserver(() => syncTheme(vmi));
  observer.observe(document.documentElement, {
    attributes: true,
    // data-sky: the "auto" theme turns dark when the sun sets.
    attributeFilter: ["data-theme", "data-sky", "class"],
  });
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => syncTheme(vmi);
  scheme.addEventListener("change", onScheme);
  return () => {
    observer.disconnect();
    scheme.removeEventListener("change", onScheme);
  };
}

/** `#rgb`, `#rrggbb` or `rgb(r g b / a)` as [r, g, b, a]. */
function parseColor(value: string): number[] | null {
  const v = value.trim();
  if (v.startsWith("#")) {
    const hex = v.slice(1);
    const full =
      hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex.slice(0, 6);
    const rgb = Number.parseInt(full, 16);
    if (Number.isNaN(rgb)) return null;
    return [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255, 1];
  }
  const parts = v.match(/[\d.]+%?/g);
  if (!v.startsWith("rgb") || !parts || parts.length < 3) return null;
  const [r, g, b] = parts.map(Number.parseFloat);
  const a = parts[3]?.endsWith("%")
    ? Number.parseFloat(parts[3]) / 100
    : Number.parseFloat(parts[3] ?? "1");
  return [r, g, b, a];
}

function syncTheme(vmi: ViewModelInstance) {
  const style = getComputedStyle(document.documentElement);
  const paper = parseColor(style.getPropertyValue("--bg")) ?? [
    255, 255, 255, 1,
  ];
  for (const [prop, cssVar] of THEME) {
    const color = parseColor(style.getPropertyValue(cssVar));
    if (!color) continue;
    // Translucent tokens (--muted, --line-strong) are flattened onto paper.
    const [r, g, b] = color.map((c, i) =>
      i < 3 ? Math.round(c * color[3] + paper[i] * (1 - color[3])) : c,
    );
    vmi.color(prop)?.argb(255, r, g, b);
  }
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v));
const between = ([min, max]: number[]) => min + Math.random() * (max - min);

export default function RiveScene({
  avatarStyle,
  thoughtStyle,
  thoughts,
  replies,
}: {
  avatarStyle: CSSProperties;
  thoughtStyle: CSSProperties;
  thoughts: Thought[];
  replies: Replies;
}) {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  // Read lazily by the avatar, so neither re-runs its setup.
  const bubble = useRef<ViewModelInstance | null>(null);
  const onBubble = useCallback((vmi: ViewModelInstance | null) => {
    bubble.current = vmi;
  }, []);
  const ideas = useRef(thoughts);
  ideas.current = thoughts;
  const answers = useRef(replies);
  answers.current = replies;

  const fade = `transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`;
  return (
    <>
      <div
        aria-hidden
        style={avatarStyle}
        className={`absolute overflow-hidden bg-bg ${fade}`}
      >
        <Avatar
          onReady={onReady}
          bubble={bubble}
          thoughts={ideas}
          replies={answers}
        />
      </div>
      <div
        aria-hidden
        style={thoughtStyle}
        className={`pointer-events-none absolute ${fade}`}
      >
        <Bubble onBind={onBubble} />
      </div>
    </>
  );
}

type PopOptions = {
  code?: boolean;
  typeMs?: number;
  /** Called once the last character is written. */
  onTyped?: () => void;
  /** How long the whole line stays up once written, in ms. */
  linger?: (text: string) => number;
  after?: () => void;
};

/**
 * Types lines into a Thought artboard instance. One timer chain drives it, so
 * a new line (or `cancel`) cuts the current one short; `later` schedules on
 * the same chain.
 */
export function bubbleWriter(bubble: RefObject<ViewModelInstance | null>) {
  let timer: ReturnType<typeof setTimeout>;
  const later = (ms: number, fn: () => void) => {
    timer = setTimeout(fn, ms);
  };
  const cancel = () => clearTimeout(timer);
  /** Opens the bubble (if needed), types `text`, lingers, closes, then `after`. */
  const pop = (
    text: string,
    {
      code = false,
      typeMs = TYPE_MS.idea,
      onTyped,
      linger = (t) => 1800 + t.length * 30,
      after = () => {},
    }: PopOptions = {},
  ) => {
    const b = bubble.current;
    if (!b) return after();
    // `rest` is drawn transparent, so the paragraph keeps its final layout.
    const write = (count: number) => {
      const typed = b.string("typed");
      const rest = b.string("rest");
      if (typed) typed.value = text.slice(0, count);
      if (rest) rest.value = text.slice(count);
    };
    const open = b.boolean("open");
    const wasOpen = open?.value ?? false;
    const isCode = b.boolean("isCode");
    if (isCode) isCode.value = code;
    write(0);
    if (open) open.value = true;
    let count = 0;
    const type = () => {
      count += 1;
      write(count);
      if (count < text.length) return later(typeMs, type);
      onTyped?.();
      later(linger(text), () => {
        if (open) open.value = false;
        later(350, after);
      });
    };
    later(wasOpen ? 0 : 550, type);
  };
  const close = () => {
    cancel();
    const open = bubble.current?.boolean("open");
    if (open) open.value = false;
  };
  return { later, pop, cancel, close };
}

/** A bubble artboard (scripts/rive/bubble.mjs), themed, handed to `onBind`. */
export function Bubble({
  onBind,
  src = SRC,
  artboard = "Thought",
}: {
  onBind: (vmi: ViewModelInstance | null) => void;
  src?: string;
  /** The artboard; its state machine bears the same name. */
  artboard?: string;
}) {
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachine: artboard,
    autoplay: true,
    autoBind: true,
    layout: LAYOUT,
  });

  useEffect(() => {
    const vmi = rive?.viewModelInstance;
    if (!vmi) return;
    const stop = watchTheme(vmi);
    onBind(vmi);
    return () => {
      stop();
      onBind(null);
    };
  }, [rive, onBind]);

  return <RiveComponent className="size-full" />;
}

function Avatar({
  onReady,
  bubble,
  thoughts,
  replies,
}: {
  onReady: () => void;
  bubble: RefObject<ViewModelInstance | null>;
  thoughts: RefObject<Thought[]>;
  replies: RefObject<Replies>;
}) {
  const { rive, canvas, RiveComponent } = useRive({
    src: SRC,
    artboard: "Avatar",
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
    // Codes unless asked not to; stops while dozing or lost in a thought.
    // (The .riv itself makes him look up on hover and while talking.)
    let wantsTyping = true;
    let dozing = false;
    let musing = false;
    const applyTyping = () => {
      const prop = vmi.boolean("isTyping");
      if (prop) prop.value = wantsTyping && !dozing && !musing;
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
    cleanups.push(watchTheme(vmi));

    // --- pokes: laughs until it gets old, then humor recovers ---------------
    // The .riv fires `poke` from its own click listener; observe the trigger.
    const poke = vmi.trigger("poke");
    let onPokeReply = () => {}; // set once the bubble is wired, below
    const onPoke = () => {
      emitAvatarEvent({ type: "poke" });
      onPokeReply();
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

    // --- the bubble: thoughts now and then, replies to the visitor ---------
    // One timer chain drives it, so a reply simply cuts a thought short.
    const writer = bubbleWriter(bubble);
    const { later, pop } = writer;
    let queue: Thought[] = [];
    // Thoughts only come when he is free: not dozing, not reacting to the
    // page, not hovered or talking.
    const free = () =>
      !dozing &&
      !document.hidden &&
      shown === base &&
      !vmi.boolean("hover")?.value &&
      !vmi.boolean("isTalking")?.value;
    const muse = (on: boolean) => {
      musing = on;
      const prop = vmi.boolean("isMusing");
      if (prop) prop.value = on;
      applyTyping();
      if (on) show("thinking");
      else if (shown === "thinking") show(base);
    };
    const nextThought = () => later(between(THOUGHT_GAP), think);
    const think = () => {
      const pool = thoughts.current;
      if (!bubble.current || !pool.length || !free()) return later(3000, think);
      if (!queue.length) queue = [...pool].sort(() => Math.random() - 0.5);
      const { text, code = false } = queue.pop() as Thought;
      muse(true);
      pop(text, {
        code,
        typeMs: code ? TYPE_MS.code : TYPE_MS.idea,
        after: () => {
          muse(false);
          nextThought();
        },
      });
    };
    const lastReply: Partial<Record<Reply, string>> = {};
    /** Answers the visitor, cutting short whatever the bubble was doing. */
    const reply = (kind: Reply) => {
      const lines = replies.current[kind];
      if (!lines?.length) return;
      const choices = lines.filter((l) => l !== lastReply[kind]);
      const text = (choices.length ? choices : lines)[
        Math.floor(Math.random() * (choices.length || lines.length))
      ];
      lastReply[kind] = text;
      writer.cancel();
      if (musing) muse(false);
      pop(text, { typeMs: TYPE_MS.reply, after: nextThought });
    };
    later(FIRST_THOUGHT, think);
    cleanups.push(writer.close);

    // --- the visitor plays with him -----------------------------------------
    // Head clicks arrive as the .riv's `poke` (humor sets the tone); the
    // rest is read off the pointer, in artboard units. A click waits a beat
    // so a double-click can win; a drag is not a click.
    let pending: ReturnType<typeof setTimeout>;
    const replySoon = (kind: Reply) => {
      clearTimeout(pending);
      pending = setTimeout(() => reply(kind), DOUBLE_CLICK_MS);
    };
    onPokeReply = () => replySoon(humor() >= 50 ? "poke" : "pokeTired");
    const zone = (e: MouseEvent): Reply | "head" => {
      const r = (canvas as HTMLCanvasElement).getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * ARTBOARD;
      const y = ((e.clientY - r.top) / r.height) * ARTBOARD;
      if (Math.hypot(x - 100, y - 21) <= 11) return "chip";
      if (x >= 32 && x <= 88 && y >= 96) return "laptop";
      if (((x - 60) / 22) ** 2 + ((y - 50) / 30) ** 2 <= 1) return "head";
      return "other";
    };
    let press: { x: number; y: number } | null = null;
    let dragged = false;
    if (canvas) {
      const down = (e: PointerEvent) => {
        press = { x: e.clientX, y: e.clientY };
        dragged = false;
      };
      const move = (e: PointerEvent) => {
        if (!press || dragged) return;
        if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < DRAG_PX)
          return;
        dragged = true;
        clearTimeout(pending);
        reply("drag");
      };
      const up = () => {
        press = null;
      };
      const click = (e: MouseEvent) => {
        if (dragged) return;
        const where = zone(e);
        if (where !== "head") replySoon(where);
      };
      const dblclick = () => {
        clearTimeout(pending);
        reply("double");
      };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("click", click);
      canvas.addEventListener("dblclick", dblclick);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerup", up);
      cleanups.push(() => {
        clearTimeout(pending);
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("click", click);
        canvas.removeEventListener("dblclick", dblclick);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      });
    }

    // --- say hello -----------------------------------------------------------
    const hello = setTimeout(() => driver.fire("wave"), 600);
    cleanups.push(() => clearTimeout(hello));

    onReady();
    return () => {
      for (const fn of cleanups) fn();
    };
  }, [rive, canvas, onReady, bubble, thoughts, replies]);

  return <RiveComponent className="size-full cursor-pointer" />;
}
