/**
 * Generates the interactive Rive avatar of the hero from code, then builds it.
 *
 *   rive/avatar/scene.rml  <- generated here (do not hand-edit)
 *   public/avatar.riv      <- built with the Rive CLI (`rive <dir> --once`)
 *
 * The art mirrors components/motion/coder-avatar.tsx (line art, 120x120) and
 * is written as SVG path strings (scripts/rive/head.mjs for the head, shared
 * with the guide). Everything is driven by the `Avatar` view model so the
 * host (and later the chat) can steer it: `mood`, `humor`, `lookX/lookY`,
 * `isTalking`, `isTyping` (coding: head down, key taps; paused on hover and
 * while talking), and the triggers `wave`, `poke`, `solve`, `celebrate`. A
 * second artboard, `Thought`, is the bubble the host types thoughts into.
 *
 * Usage: pnpm avatar
 */

import { bubbleArtboard, cloudD } from "./rive/bubble.mjs";
import {
  blinkAnim,
  buildHead,
  faint,
  joyful,
  lookAnims,
  soft,
  talkAnims,
} from "./rive/head.mjs";
import {
  ANIMS,
  anim,
  computeRest,
  cond,
  done,
  el,
  ellipse,
  fire,
  group,
  id,
  layer,
  line,
  listener,
  loopLayer,
  nodeXml,
  path,
  pose,
  REG,
  rect,
  setViewModel,
  shapeXml,
  st,
  to,
  toggleLayer,
  writeBool,
  writeProject,
} from "./rive/kit.mjs";

// ---------------------------------------------------------------------------
// View model
// ---------------------------------------------------------------------------

const MOODS = [
  "neutral",
  "happy",
  "laughing",
  "thinking",
  "surprised",
  "confused",
  "sleepy",
  "focused",
];

const VM = { id: id(), inst: id(), enumId: id(), props: {}, moodIds: {} };
for (const m of MOODS) VM.moodIds[m] = id();
const PROPS = [
  ["mood", "enum", "neutral"],
  ["humor", "number", 60],
  ["lookX", "number", 0],
  ["lookY", "number", 0],
  ["hover", "boolean", false],
  ["isTyping", "boolean", true],
  ["isTalking", "boolean", false],
  ["isMusing", "boolean", false],
  ["wave", "trigger"],
  ["poke", "trigger"],
  ["solve", "trigger"],
  ["celebrate", "trigger"],
  ["ink", "color", "FF171717"],
  ["inkSoft", "color", "FF666666"],
  ["inkFaint", "color", "FFD6D6D6"],
  ["paper", "color", "FFFFFFFF"],
];
for (const [name] of PROPS) VM.props[name] = id();
setViewModel(VM);

function viewModelXml() {
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const props = PROPS.map(([name, type]) =>
    type === "enum"
      ? el("ViewModelPropertyEnumCustom", {
          enumId: VM.enumId,
          name,
          id: VM.props[name],
        })
      : el(`ViewModelProperty${cap(type)}`, { name, id: VM.props[name] }),
  );
  const values = PROPS.map(([name, type, value]) => {
    const vp = VM.props[name];
    if (type === "enum")
      return el("ViewModelInstanceEnum", {
        propertyValue: VM.moodIds[value],
        viewModelPropertyId: vp,
      });
    if (type === "trigger")
      return el("ViewModelInstanceTrigger", { viewModelPropertyId: vp });
    return el(`ViewModelInstance${cap(type)}`, {
      propertyValue: typeof value === "boolean" ? String(value) : value,
      viewModelPropertyId: vp,
    });
  });
  return [
    el(
      "DataEnumCustom",
      { name: "Mood", id: VM.enumId },
      MOODS.map((m) =>
        el("DataEnumValue", { key: m, value: cap(m), id: VM.moodIds[m] }),
      ),
    ),
    el("ViewModel", { defaultInstanceId: VM.inst, name: "Avatar", id: VM.id }, [
      ...props,
      el(
        "ViewModelInstance",
        { exports: "true", name: "Default", id: VM.inst },
        values,
      ),
    ]),
  ];
}

REG.Trim = { id: id() }; // the typing line's TrimPath

// ---------------------------------------------------------------------------
// The art (120x120, same coordinates as coder-avatar.tsx)
// ---------------------------------------------------------------------------

const head = buildHead();

const character = group(
  "Character",
  [0, 0],
  [
    group(
      "Breath",
      [60, 120],
      [
        line("M54 74V80.5M66 74V80.5"),
        line("M54 80L60 89L66 80"),
        line("M54 80L47.5 85.5L52.5 92.5L60 89L67.5 92.5L72.5 85.5L66 80"),
        line("M60 89V96"),
        line("M47.5 85.5C38 87 30 90 25 95.5C20 101 17 110 16 122"),
        line("M72.5 85.5C82 87 90 90 95 95.5C100 101 103 110 104 122"),
        head,
        rect(32, 96, 56, 30, 3),
        line("M55.5 105.5l-3 3 3 3M64.5 105.5l3 3-3 3M61.4 104.5l-2.8 8", {
          ...soft,
          w: 1.2,
        }),
        group(
          "KeyTaps",
          [60, 92],
          [
            line("M42.6 93.4l-1.8-2.4", {
              ...soft,
              w: 1.1,
              name: "TapL",
              opacity: 0,
            }),
            line("M77.4 93.4l1.8-2.4", {
              ...soft,
              w: 1.1,
              name: "TapR",
              opacity: 0,
            }),
          ],
        ),
      ],
    ),
  ],
);

const extras = group(
  "Extras",
  [0, 0],
  [
    group(
      "Bubble",
      [21.5, 20],
      [
        group(
          "BubbleFloat",
          [21.5, 20],
          [
            group(
              "BubbleGate",
              [21.5, 20],
              [
                rect(8, 12, 27, 16, 5, faint),
                line("M12.5 17.8h9"),
                line("M12.5 22.6h12", {
                  ...soft,
                  name: "TypingLine",
                  effects: [
                    el("TrimPath", {
                      start: 0,
                      end: 1,
                      modeValue: "sequential",
                      name: "Trim",
                      id: REG.Trim.id,
                    }),
                  ],
                }),
                line("M28.6 20.4v4.6", { w: 1.2, name: "Cursor" }),
              ],
              { opacity: 0 },
            ),
          ],
        ),
      ],
    ),
    group(
      "Chip",
      [100, 21],
      [
        ellipse(100, 21, 8.5, 8.5, faint),
        group(
          "ChipQ",
          [100, 21],
          [
            line(
              "M97.6 18.8a2.4 2.4 0 1 1 3.4 2.1c-.8.4-1 .9-1 1.7M100 24.7v.1",
              { ...soft, w: 1.5 },
            ),
          ],
        ),
        group(
          "ChipCheck",
          [100, 21],
          [line("M96.4 21.2l2.4 2.4L103.8 18.4", { w: 1.6 })],
          {
            opacity: 0,
          },
        ),
      ],
    ),
    // The gate hides them while the thought bubble (another artboard) is up.
    group(
      "ThinkDotsGate",
      [88, 30],
      [
        group(
          "ThinkDots",
          [88, 30],
          [
            ellipse(83.5, 35, 0.6, 0.6, soft),
            ellipse(87.5, 30.5, 0.9, 0.9, soft),
            ellipse(92.5, 25.5, 1.3, 1.3, soft),
          ],
          { opacity: 0 },
        ),
      ],
    ),
    group(
      "QMarks",
      [89, 34],
      [
        line(
          "M86.6 31.4a2 2 0 1 1 2.8 1.8c-.7.3-.8.8-.8 1.4M88.6 37.2v.1",
          soft,
        ),
        line("M92.8 27.6a1.5 1.5 0 1 1 2.1 1.3c-.5.2-.6.6-.6 1M94.3 31.9v.1", {
          ...soft,
          w: 1.1,
        }),
      ],
      { opacity: 0 },
    ),
    group(
      "Zzz",
      [86, 38],
      [
        line("M84 43h3l-3 3.5h3", { ...soft, w: 1.2 }),
        line("M89 33h4.5l-4.5 5.5h4.5", soft),
      ],
      { opacity: 0 },
    ),
    group(
      "LaughLines",
      [60, 48],
      [
        line(
          "M37 42.5l-3.6-2M35.6 48.5H31.5M82.5 42.5l3.6-2M84.4 48.5H88.5",
          soft,
        ),
      ],
      { opacity: 0 },
    ),
    group(
      "SweatDrop",
      [80, 40],
      [
        line(
          "M80 36C80 36 77.6 39.4 77.6 40.9A2.4 2.4 0 0 0 82.4 40.9C82.4 39.4 80 36 80 36Z",
          soft,
        ),
      ],
      { opacity: 0 },
    ),
    group(
      "Sparkles",
      [60, 48],
      [
        line(
          "M31 26v6M28 29h6M91 30v6M88 33h6M27 58v5M24.5 60.5h5M94 60v5M91.5 62.5h5",
          soft,
        ),
      ],
      { opacity: 0 },
    ),
  ],
);

// Hit areas: transparent fills, drawn on top. Every listener under the
// pointer fires, so they may overlap.
const TRANSPARENT = { fill: null, w: 0 };
const hits = [
  rect(0, 0, 120, 120, 0, { ...TRANSPARENT, name: "HitArea" }),
  rect(32, 96, 56, 24, 3, { ...TRANSPARENT, name: "HitLaptop" }),
  ellipse(60, 50, 22, 30, { ...TRANSPARENT, name: "HitHead" }),
  ellipse(100, 21, 11, 11, { ...TRANSPARENT, name: "HitChip" }),
];

computeRest(character, [0, 0]);
computeRest(extras, [0, 0]);

function hitXml(s) {
  const xml = shapeXml(s, [0, 0]);
  // A fully transparent fill is still hit-testable.
  return xml.replace(
    /<\/Shape>$/,
    `${el("Fill", { name: "Hit" }, [el("SolidColor", { colorValue: "00000000", name: "C" })])}</Shape>`,
  );
}

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

// --- mood poses ------------------------------------------------------------

const MOOD_DEFAULT = {
  "HeadMood.rotation": 0,
  "HeadMood.y": 0,
  "FeaturesMood.y": 0,
  "BrowL.y": 0,
  "BrowL.rotation": 0,
  "BrowR.y": 0,
  "BrowR.rotation": 0,
  "EyesOpen.opacity": 1,
  "EyesOpen.scale": 1,
  "EyesOpen.y": 0,
  "EyesHappy.opacity": 0,
  "EyesClosed.opacity": 0,
  "MouthSmile.opacity": 1,
  "MouthGrin.opacity": 0,
  "MouthO.opacity": 0,
  "MouthFlat.opacity": 0,
  "MouthSmirk.opacity": 0,
  "MouthSleepy.opacity": 0,
  "LaughLines.opacity": 0,
  "LaughLines.scale": 1,
  "Zzz.opacity": 0,
  "Zzz.y": 0,
  "ThinkDots.opacity": 0,
  "QMarks.opacity": 0,
};

const MOOD_POSES = {
  neutral: {},
  happy: {
    "MouthSmile.opacity": 0,
    "MouthGrin.opacity": 1,
    "BrowL.y": -0.6,
    "BrowR.y": -0.6,
    "HeadMood.rotation": -0.04,
  },
  laughing: {
    "EyesOpen.opacity": 0,
    "EyesHappy.opacity": 1,
    "MouthSmile.opacity": 0,
    "MouthGrin.opacity": 1,
    "BrowL.y": -1,
    "BrowR.y": -1,
    "LaughLines.opacity": 1,
  },
  thinking: {
    "EyesOpen.y": -0.9,
    "EyesOpen.scale": 0.95,
    "MouthSmile.opacity": 0,
    "MouthFlat.opacity": 1,
    "BrowL.y": -1.3,
    "BrowL.rotation": -0.12,
    "BrowR.y": 0.3,
    "BrowR.rotation": 0.1,
    "HeadMood.rotation": 0.07,
    "ThinkDots.opacity": 1,
  },
  surprised: {
    "EyesOpen.scale": 1.3,
    "MouthSmile.opacity": 0,
    "MouthO.opacity": 1,
    "BrowL.y": -2.2,
    "BrowR.y": -2.2,
    "HeadMood.y": -0.8,
  },
  confused: {
    "MouthSmile.opacity": 0,
    "MouthSmirk.opacity": 1,
    "BrowL.y": -1.4,
    "BrowL.rotation": -0.15,
    "BrowR.y": 0.4,
    "BrowR.rotation": 0.15,
    "HeadMood.rotation": -0.1,
    "QMarks.opacity": 1,
  },
  sleepy: {
    "EyesOpen.opacity": 0,
    "EyesClosed.opacity": 1,
    "MouthSmile.opacity": 0,
    "MouthSleepy.opacity": 1,
    "BrowL.y": 0.6,
    "BrowR.y": 0.6,
    "HeadMood.rotation": 0.12,
    "HeadMood.y": 1.2,
    "Zzz.opacity": 1,
  },
  focused: {
    "EyesOpen.y": 0.8,
    "EyesOpen.scale": 0.9,
    "MouthSmile.opacity": 0,
    "MouthFlat.opacity": 1,
    "BrowL.y": 0.8,
    "BrowL.rotation": 0.08,
    "BrowR.y": 0.8,
    "BrowR.rotation": -0.08,
    "HeadMood.y": 0.6,
  },
};

const MOOD_LOOPS = {
  laughing: {
    duration: 36,
    tracks: {
      "HeadMood.rotation": [
        [0, -0.04],
        [9, 0.04],
        [18, -0.04],
        [27, 0.04],
        [36, -0.04],
      ],
      "HeadMood.y": [
        [0, 0],
        [9, -1.2],
        [18, 0],
        [27, -1.2],
        [36, 0],
      ],
      "LaughLines.scale": [
        [0, 0.9],
        [9, 1.1],
        [18, 0.9],
        [27, 1.1],
        [36, 0.9],
      ],
    },
  },
  sleepy: {
    duration: 120,
    tracks: {
      "Zzz.y": [
        [0, 0],
        [60, -2.5],
        [120, 0],
      ],
      "HeadMood.y": [
        [0, 1.2],
        [60, 1.8],
        [120, 1.2],
      ],
    },
  },
};

const moodAnims = Object.fromEntries(
  MOODS.map((m) => {
    const values = { ...MOOD_DEFAULT, ...MOOD_POSES[m] };
    const loopDef = MOOD_LOOPS[m];
    if (loopDef) for (const k of Object.keys(loopDef.tracks)) delete values[k];
    return [
      m,
      pose(
        `Mood ${m}`,
        values,
        loopDef
          ? { duration: loopDef.duration, loop: "loop", tracks: loopDef.tracks }
          : {},
      ),
    ];
  }),
);

// --- reactions (one-shots) ------------------------------------------------

const REACT_REST = {
  "HeadReact.rotation": 0,
  "HeadReact.y": 0,
  "EyesReactGate.opacity": 1,
  "EyesReactHappy.opacity": 0,
  "EyesRoll.y": 0,
  "MouthsReactGate.opacity": 1,
  "MouthReactGrin.opacity": 0,
  "MouthReactFlat.opacity": 0,
  "Sparkles.opacity": 0,
  "Sparkles.scale": 0.6,
  "SweatDrop.opacity": 0,
  "SweatDrop.y": 0,
};

/** Fill in every reaction-owned property, so blends always have a target. */
function reaction(name, duration, tracks) {
  const full = { ...tracks };
  for (const [k, v] of Object.entries(REACT_REST)) {
    if (!full[k]) full[k] = [[0, v, "hold"]];
  }
  return anim(name, { duration }, full);
}

const reactRest = pose("React rest", REACT_REST);

const reactWave = reaction("React wave", 120, {
  "HeadReact.rotation": [
    [0, 0],
    [16, -0.06, "hold"],
    [92, -0.06],
    [108, 0],
  ],
  // Look up from the screen at the visitor.
  "HeadReact.y": [
    [0, 0],
    [14, -0.9, "hold"],
    [96, -0.9],
    [110, 0],
  ],
  ...joyful(8, 100),
});

const reactPokeLaugh = reaction("React poke laugh", 72, {
  "HeadReact.y": [
    [0, 0],
    [6, -2],
    [14, 0],
    [22, -1.5],
    [30, 0],
    [38, -0.8],
    [46, 0, "hold"],
  ],
  "HeadReact.rotation": [
    [0, 0],
    [8, 0.05],
    [20, -0.05],
    [32, 0.03],
    [44, 0, "hold"],
  ],
  ...joyful(2, 64),
});

const reactPokeMeh = reaction("React poke meh", 96, {
  "EyesRoll.y": [
    [0, 0],
    [12, -1.6, "hold"],
    [60, -1.6],
    [72, 0, "hold"],
  ],
  "MouthsReactGate.opacity": [
    [0, 1, "linear"],
    [4, 0, "hold"],
    [80, 0, "linear"],
    [84, 1],
  ],
  "MouthReactFlat.opacity": [
    [0, 0, "linear"],
    [4, 1, "hold"],
    [80, 1, "linear"],
    [84, 0],
  ],
  "SweatDrop.opacity": [
    [0, 0],
    [10, 1, "hold"],
    [76, 1],
    [88, 0],
  ],
  "SweatDrop.y": [
    [0, 0, "hold"],
    [10, 0],
    [88, 3],
  ],
  "HeadReact.rotation": [
    [0, 0],
    [12, 0.08, "hold"],
    [72, 0.08],
    [88, 0],
  ],
});

// The chip runs on its own layer: the host fires `solve` on every beam
// cycle, and sharing the reaction layer would swallow pokes and waves.
const CHIP_REST = {
  "ChipQ.opacity": 1,
  "ChipQ.scale": 1,
  "ChipCheck.opacity": 0,
  "ChipCheck.scale": 0.4,
  "Glint.opacity": 0,
};
const chipRest = pose("Chip rest", CHIP_REST);
const chipSolve = anim(
  "Chip solve",
  { duration: 120 },
  {
    "ChipQ.opacity": [
      [0, 1],
      [8, 0, "hold"],
      [104, 0],
      [114, 1],
    ],
    "ChipQ.scale": [
      [0, 1],
      [8, 0.4, "hold"],
      [104, 0.4],
      [114, 1],
    ],
    "ChipCheck.opacity": [
      [0, 0, "hold"],
      [8, 0],
      [14, 1, "hold"],
      [94, 1],
      [102, 0],
    ],
    "ChipCheck.scale": [
      [0, 0.4, "hold"],
      [8, 0.4],
      [16, 1.2],
      [24, 1, "hold"],
      [94, 1],
      [102, 0.4],
    ],
    "Glint.opacity": [
      [0, 0, "hold"],
      [8, 0],
      [14, 1, "hold"],
      [48, 1],
      [62, 0],
    ],
  },
);

const reactCelebrate = reaction("React celebrate", 120, {
  "Sparkles.opacity": [
    [0, 0],
    [10, 1, "hold"],
    [70, 1],
    [92, 0],
  ],
  "Sparkles.scale": [
    [0, 0.6],
    [30, 1.15, "hold"],
    [92, 1.15],
  ],
  "HeadReact.y": [
    [0, 0],
    [10, -2],
    [22, 0],
    [32, -1.2],
    [42, 0, "hold"],
  ],
  ...joyful(4, 104),
});

// --- loops and toggles -----------------------------------------------------

const breathe = anim(
  "Breathe",
  { duration: 240, loop: "pingPong" },
  {
    "Breath.y": [
      [0, 0],
      [240, -0.7],
    ],
    "BubbleFloat.y": [
      [0, 0],
      [240, -1.6],
    ],
  },
);

const blink = blinkAnim();

const hoverOff = pose("Hover off", {
  "HeadHover.rotation": 0,
  "HeadHover.y": 0,
  "BrowsHover.y": 0,
});
const hoverOn = pose("Hover on", {
  "HeadHover.rotation": -0.05,
  "HeadHover.y": -0.8,
  "BrowsHover.y": -0.7,
});

// Coding: head bent to the screen, a tick above the lid for each key press
// (a burst, then a pause to read).
const KEY_PRESSES = {
  L: [2, 14, 30, 46, 62],
  R: [8, 22, 38, 54, 70],
};
const presses = (frames, down, up) => [
  [0, up, "hold"],
  ...frames.flatMap((f) => [
    [f, up, "linear"],
    [f + 3, down],
    [f + 7, up, "hold"],
  ]),
];
const typingOff = pose("Typing off", {
  "BubbleGate.opacity": 0,
  "Trim.end": 1,
  "Cursor.opacity": 0,
  "HeadCode.y": 0,
  "HeadCode.rotation": 0,
  "EyesDown.y": 0,
  "TapL.opacity": 0,
  "TapR.opacity": 0,
});
const typingOn = anim(
  "Typing on",
  { duration: 120, loop: "loop" },
  {
    "HeadCode.y": [
      [0, 1],
      [60, 1.3],
      [120, 1],
    ],
    "HeadCode.rotation": [[0, 0.03, "hold"]],
    "EyesDown.y": [[0, 1.1, "hold"]],
    "TapL.opacity": presses(KEY_PRESSES.L, 1, 0),
    "TapR.opacity": presses(KEY_PRESSES.R, 1, 0),
    "BubbleGate.opacity": [[0, 1, "hold"]],
    "Trim.end": [
      [0, 0, "hold"],
      [18, 0.25, "hold"],
      [34, 0.5, "hold"],
      [50, 0.75, "hold"],
      [66, 1, "hold"],
      [119, 1, "hold"],
    ],
    "Cursor.opacity": [
      [0, 1, "hold"],
      [30, 0, "hold"],
      [60, 1, "hold"],
      [90, 0, "hold"],
    ],
  },
);

const musingOff = pose("Musing off", { "ThinkDotsGate.opacity": 1 });
const musingOn = pose("Musing on", { "ThinkDotsGate.opacity": 0 });

const { talkQuiet, talkOn } = talkAnims();
const { lookX, lookY } = lookAnims();

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

const moodLayer = layer("Mood", () => {
  const ids = Object.fromEntries(MOODS.map((m) => [m, id()]));
  const states = MOODS.map(
    (m, i) =>
      st(moodAnims[m], 160 + (i % 4) * 200, 100 + Math.floor(i / 4) * 120, [], {
        id: ids[m],
      }).xml,
  );
  return {
    first: ids.neutral,
    any: MOODS.map((m) =>
      to(ids[m], { duration: 260 }, [cond.enum("mood", VM.moodIds[m])]),
    ),
    xml: states,
  };
});

const reactionLayer = layer("Reaction", () => {
  const rest = id();
  const s = {
    wave: st(reactWave, 160, 260, [done(rest)]),
    laugh: st(reactPokeLaugh, 360, 260, [done(rest)]),
    meh: st(reactPokeMeh, 560, 260, [done(rest)]),
    party: st(reactCelebrate, 960, 260, [done(rest)]),
  };
  const restState = st(
    reactRest,
    160,
    100,
    [
      to(s.wave.id, { duration: 80 }, [cond.trigger("wave")]),
      to(s.laugh.id, { duration: 80 }, [
        cond.trigger("poke"),
        cond.number("humor", "greaterThanOrEqual", 50),
      ]),
      to(s.meh.id, { duration: 80 }, [
        cond.trigger("poke"),
        cond.number("humor", "lessThan", 50),
      ]),
      to(s.party.id, { duration: 80 }, [cond.trigger("celebrate")]),
    ],
    { id: rest },
  );
  return {
    first: rest,
    xml: [restState.xml, ...Object.values(s).map((x) => x.xml)],
  };
});

const chipLayer = layer("Chip", () => {
  const rest = id();
  const solve = st(chipSolve, 360, 100, [done(rest)]);
  const restState = st(
    chipRest,
    160,
    100,
    [to(solve.id, { duration: 60 }, [cond.trigger("solve")])],
    { id: rest },
  );
  return { first: rest, xml: [restState.xml, solve.xml] };
});

// Codes while `isTyping`, but looks up from the keyboard when the visitor
// hovers him or he is talking.
const typingLayer = layer("Typing", () => {
  const offId = id();
  const onId = id();
  const stop = (c) => to(offId, { duration: 220 }, [c]);
  return {
    first: offId,
    xml: [
      st(
        typingOff,
        160,
        100,
        [
          to(onId, { duration: 400 }, [
            cond.bool("isTyping", true),
            cond.bool("hover", false),
            cond.bool("isTalking", false),
          ]),
        ],
        { id: offId },
      ).xml,
      st(
        typingOn,
        360,
        100,
        [
          stop(cond.bool("isTyping", false)),
          stop(cond.bool("hover", true)),
          stop(cond.bool("isTalking", true)),
        ],
        { id: onId },
      ).xml,
    ],
  };
});

const SM = id();

const stateMachine = el("StateMachine", { name: "Avatar", id: SM }, [
  listener("HitArea", "enter", [writeBool("hover", true)], "Hover in"),
  listener("HitArea", "exit", [writeBool("hover", false)], "Hover out"),
  listener("HitHead", "click", [fire("poke")], "Poke"),
  listener("HitChip", "click", [fire("solve")], "Solve"),
  listener("HitLaptop", "click", [fire("celebrate")], "Ship it"),
  loopLayer("Breathe", breathe),
  loopLayer("Blink", blink),
  moodLayer,
  toggleLayer("Hover", "hover", hoverOff, hoverOn),
  typingLayer,
  toggleLayer("Talk", "isTalking", talkQuiet, talkOn, [100, 160]),
  toggleLayer("Musing", "isMusing", musingOff, musingOn),
  reactionLayer,
  chipLayer,
]);

// ---------------------------------------------------------------------------
// Thought bubble: a second artboard, drawn by the host above the avatar's box
// (the box itself is too small for legible text).
// ---------------------------------------------------------------------------

const avatarAnims = ANIMS.splice(0);
const thought = bubbleArtboard({
  label: "Thought",
  size: { w: 240, h: 120 },
  stage: { x: 200, y: 0 },
  outline: cloudD(14, 12, 212, 64, 26, 16),
  tail: [
    [122, 113, 2.2],
    [126, 102.5, 3.2],
    [131, 90.5, 4.4],
  ],
  pivot: [131, 80],
  textAt: [120, 44],
  fontSize: 12,
  lineHeight: 15,
  placeholder: "Clean Architecture",
});

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

const ART = id();
const ART_STYLE = id();

const doc = el("Rive", { version: 1, kind: "fragment" }, [
  el(
    "Artboard",
    {
      defaultStateMachineId: SM,
      viewModelId: VM.id,
      viewModelInstanceId: VM.inst,
      clip: "true",
      width: 120,
      height: 120,
      name: "Avatar",
      styleId: ART_STYLE,
      id: ART,
    },
    [
      el("LayoutComponentStyle", { name: "Artboard Style", id: ART_STYLE }),
      ...[...hits].reverse().map(hitXml),
      nodeXml(extras, [0, 0]),
      nodeXml(character, [0, 0]),
      el(
        "Joystick",
        {
          posX: 60,
          posY: 60,
          width: 120,
          height: 120,
          xId: lookX,
          yId: lookY,
          name: "Look",
        },
        [
          el("DataBindContext", {
            sourcePathIds: path("lookX"),
            propertyKey: 299,
          }),
          el("DataBindContext", {
            sourcePathIds: path("lookY"),
            propertyKey: 300,
          }),
        ],
      ),
      stateMachine,
      ...avatarAnims,
    ],
  ),
  thought.artboard,
  ...viewModelXml(),
  thought.viewModel(),
  el("FontAsset", {
    file: "fonts/NotoSans-Regular.ttf",
    name: "Noto Sans",
    id: thought.fontId,
  }),
]);

writeProject("avatar", doc, "scripts/avatar-rive.mjs");
