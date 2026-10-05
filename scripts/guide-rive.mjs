/**
 * Generates the guide: the avatar peeking into a section like someone asking
 * to come into a room, then builds it.
 *
 *   rive/guide/scene.rml  <- generated here (do not hand-edit)
 *   public/guide.riv      <- built with the Rive CLI (`rive <dir> --once`)
 *
 * The artboard's left edge is the section's border, the door frame: his body
 * is behind it, his head leans out, tilted, one hand holds the frame and the
 * other (on the right) waves and gestures while he talks. Everything that is
 * not drawn disappears behind that edge, never into thin air.
 *
 * View model `Guide`: `here` (peek in / lean back out), `isTalking` (mouth
 * and a nodding head), `gesture` (what the right hand does, see GESTURES),
 * `mood` (the face, see MOODS), `reach` (-1 leans back, 1 leans in),
 * `lookX/lookY`, and the ink colours. A second artboard, `Bubble`, is the
 * speech balloon the host types into.
 *
 * Usage: pnpm guide
 */

import { bubbleArtboard } from "./rive/bubble.mjs";
import { blinkAnim, buildHead, lookAnims, talkAnims } from "./rive/head.mjs";
import {
  ANIMS,
  anim,
  computeRest,
  cond,
  done,
  el,
  group,
  INK,
  id,
  layer,
  line,
  loopLayer,
  n,
  nodeXml,
  path,
  pose,
  setViewModel,
  simpleViewModel,
  st,
  to,
  toggleLayer,
  writeProject,
} from "./rive/kit.mjs";

const { vm: VM, xml: viewModelXml } = simpleViewModel("Guide", [
  ["here", "boolean", false],
  ["isTalking", "boolean", false],
  ["gesture", "number", 0],
  ["mood", "number", 0],
  ["reach", "number", 0],
  ["lookX", "number", 0],
  ["lookY", "number", 0],
  ["ink", "color", INK.ink],
  ["inkSoft", "color", INK.inkSoft],
  ["inkFaint", "color", INK.inkFaint],
  ["paper", "color", INK.paper],
]);
setViewModel(VM);

// ---------------------------------------------------------------------------
// The art. Guide coordinates: x = 0 is the door frame (the section's border);
// the head is authored in the avatar's own coordinates and placed by `at`.
// ---------------------------------------------------------------------------

const SIZE = { w: 84, h: 132 };
const TILT = 0.62; // the head leans out, top first
const NECK = [60, 84]; // the head's base, in avatar coordinates
const NECK_AT = [0, 96]; // ... and where it sits by the frame
const PEEK_PIVOT = [-40, 150]; // his hips, well behind the frame
const WRIST = [53, 84];

// Hands, fingers up, wrist at (0, 9), thumb on +x: open, pointing up (index
// out, the others curled), thumbs up. Crease lines mark curled fingers.
const HANDS = {
  open: [
    "M-5 9L-5 -11C-5 -13.2 -2 -13.2 -2 -11L-2 -15C-2 -17.2 1 -17.2 1 -15L1 -14C1 -16.2 4 -16.2 4 -14L4 -10.5C4 -12.7 7 -12.7 7 -10.5L7 -2.5L9.2 -5.4C10.4 -7 12.6 -5.6 11.5 -3.8L7.6 3C6.6 4.8 5.5 6 5.5 9Z",
  ],
  point: [
    "M-5 9L-5 -3.5C-5 -6 -2 -6.5 -1 -5C0 -6.8 3 -6.6 4 -5L4 -14.5C4 -16.8 7 -16.8 7 -14.5L7 -2.5L9.2 -4.6C10.4 -6 12.4 -4.8 11.4 -3.2L7.6 3C6.6 4.8 5.5 6 5.5 9Z",
    "M-4.3 -1.4C-2.6 -0.4 1.4 -0.4 3.4 -1.4",
  ],
  thumb: [
    "M-5 9L-5 -3C-5 -5.6 -3 -6 -1.5 -5.2C-0.5 -6.4 2 -6.4 3 -5.2L3.6 -12.8C3.8 -15.4 7.2 -15.2 7 -12.6L6.8 -4.6C9 -4.2 9.6 -1.6 8.4 0C9.4 1.4 9 3.6 7.4 4.4C7.6 6.6 6.4 8 5.5 9Z",
    "M-4.4 -0.8L2.6 -0.8M-4.4 2.6L3 2.6",
  ],
};
const place = (d, wx, wy, scale, thumb) =>
  d.replace(
    /(-?\d*\.?\d+)\s*(-?\d*\.?\d+)/g,
    (_, a, b) => `${n(wx + thumb * scale * a)} ${n(wy + scale * (b - 9))}`,
  );

// The neck runs down from the jaw to behind the frame.
const lean = group(
  "Lean",
  NECK,
  [
    // Paper inside the neck, like the sleeve, so the sky stays behind him.
    line("M54 73H66V104H54Z", { fill: "paper", w: 0 }),
    line("M54 73V104M66 73V104"),
    buildHead(),
  ],
  {
    at: NECK_AT,
    rotation: TILT,
  },
);

// The waving arm comes out from behind the frame below his chin and rises
// beside his face: a sleeve drawn as an ink tube with a paper core, no elbow.
const SLEEVE = `M-8 112C8 116 30 117 42 107C48 101 51 95 ${WRIST[0]} ${WRIST[1] + 2}`;
const arm = group(
  "Arm",
  [-8, 112],
  [
    line(SLEEVE, { w: 8.8 }),
    line(SLEEVE, { color: "paper", w: 6 }),
    group("Hand", WRIST, [
      ...Object.entries(HANDS).map(([shape, [outline, creases]]) =>
        group(
          `Hand${shape[0].toUpperCase()}${shape.slice(1)}`,
          WRIST,
          [
            line(place(outline, WRIST[0], WRIST[1] + 1, 0.82, -1), {
              fill: "paper",
            }),
            creases &&
              line(place(creases, WRIST[0], WRIST[1] + 1, 0.82, -1), {
                w: 1.1,
              }),
          ].filter(Boolean),
          { opacity: shape === "open" ? 1 : 0 },
        ),
      ),
      line(`M${WRIST[0] - 3.4} ${WRIST[1] + 1.6}H${WRIST[0] + 3.4}`, {
        w: 1.1,
      }),
    ]),
  ],
);

// His other hand holds the frame: four fingertips curled around the edge.
const FINGERS = [
  [38, 6.6],
  [42.6, 7.8],
  [47.2, 7.6],
  [51.8, 6.4],
];
const grip = group(
  "Grip",
  [0, 45],
  FINGERS.map(([y, len]) =>
    line(`M-4 ${y}H${len - 2.1}A2.1 2.1 0 0 1 ${len - 2.1} ${y + 4.2}H-4`, {
      fill: "paper",
      w: 1.2,
    }),
  ),
);

const scene = group(
  "Guide",
  [0, 0],
  [
    group("Peek", PEEK_PIVOT, [
      group("Sway", PEEK_PIVOT, [group("Reach", PEEK_PIVOT, [lean, arm])]),
    ]),
    grip,
  ],
);
computeRest(scene, [0, 0]);

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

const HIDDEN = { x: -78, rotation: -0.28, grip: -12 };
const peekHidden = pose("Peek hidden", {
  "Peek.x": HIDDEN.x,
  "Peek.rotation": HIDDEN.rotation,
  "Grip.x": HIDDEN.grip,
  "Sway.rotation": 0,
});
// Fingers first, then he leans out, a touch too far, and settles.
const peekIn = anim(
  "Peek in",
  { duration: 60 },
  {
    "Grip.x": [
      [0, HIDDEN.grip],
      [14, 0, "hold"],
    ],
    "Peek.x": [
      [0, HIDDEN.x, "hold"],
      [8, HIDDEN.x],
      [40, 3],
      [56, 0, "hold"],
    ],
    "Peek.rotation": [
      [0, HIDDEN.rotation, "hold"],
      [8, HIDDEN.rotation],
      [40, 0.05],
      [58, 0, "hold"],
    ],
    "Sway.rotation": [[0, 0, "hold"]],
  },
);
const peekIdle = anim(
  "Peek idle",
  { duration: 200, loop: "pingPong" },
  {
    "Grip.x": [[0, 0, "hold"]],
    "Peek.x": [[0, 0, "hold"]],
    "Peek.rotation": [[0, 0, "hold"]],
    "Sway.rotation": [
      [0, 0],
      [200, 0.025],
    ],
  },
);
// He leans back behind the frame, the fingers let go last.
const peekOut = anim(
  "Peek out",
  { duration: 42 },
  {
    "Peek.x": [
      [0, 0],
      [30, HIDDEN.x, "hold"],
    ],
    "Peek.rotation": [
      [0, 0],
      [30, HIDDEN.rotation, "hold"],
    ],
    "Grip.x": [
      [0, 0, "hold"],
      [24, 0],
      [40, HIDDEN.grip, "hold"],
    ],
    "Sway.rotation": [[0, 0, "hold"]],
  },
);

// What the right hand does, by `gesture`. Away is the rest: the arm pulled
// back behind the frame, so he does not wave all the time.
const GESTURES = ["away", "wave", "explain", "point", "thumb"];
const SHAPES = { open: "HandOpen", point: "HandPoint", thumb: "HandThumb" };
const shapeKeys = (shape) =>
  Object.fromEntries(
    Object.entries(SHAPES).map(([k, name]) => [
      `${name}.opacity`,
      [[0, k === shape ? 1 : 0, "hold"]],
    ]),
  );
/** A hand pose: arm offset/turn, wrist turn, shape; `tracks` animate it. */
const gesture = (
  name,
  { x = 0, y = 0, arm = 0, hand = 0, shape = "open" },
  tracks = {},
  duration = 120,
) =>
  anim(
    `Gesture ${name}`,
    { duration, loop: "loop" },
    {
      "Arm.x": [[0, x, "hold"]],
      "Arm.y": [[0, y, "hold"]],
      "Arm.rotation": [[0, arm, "hold"]],
      "Hand.rotation": [[0, hand, "hold"]],
      ...shapeKeys(shape),
      ...tracks,
    },
  );
const beat = (base, amp, frames, every) =>
  Array.from({ length: Math.floor(frames / every) + 1 }, (_, i) => [
    i * every,
    base + (i % 2 ? amp : 0),
  ]);
const gestureAnims = {
  away: gesture("away", { x: -64, y: 10 }),
  wave: gesture(
    "wave",
    { arm: -0.04 },
    {
      "Hand.rotation": [
        [0, -0.1],
        [12, 0.42],
        [24, -0.1],
      ],
    },
    24,
  ),
  // Palm open, low, beating with the words.
  explain: gesture(
    "explain",
    { arm: 0.34, hand: 0.95 },
    {
      // Lower, fingers turned out: presenting, not waving.
      "Hand.rotation": [
        [0, 0.95],
        [18, 0.8],
        [36, 1.05],
        [54, 0.82],
        [72, 0.95],
      ],
      "Arm.rotation": [
        [0, 0.34],
        [36, 0.3],
        [72, 0.34],
      ],
    },
    72,
  ),
  // Index up: "here's a thing", bobbing with the point.
  point: gesture(
    "point",
    { arm: -0.06, hand: -0.1, shape: "point" },
    {
      "Arm.y": beat(0, -2.2, 60, 15),
    },
    60,
  ),
  thumb: gesture(
    "thumb",
    { arm: 0.06, hand: 0.05, shape: "thumb" },
    {
      "Arm.y": [
        [0, 0],
        [10, -2.4],
        [20, 0, "hold"],
        [60, 0],
      ],
    },
    60,
  ),
};

// The face, by `mood`. Every pose sets the same properties.
const MOODS = ["neutral", "happy", "surprised", "thinking", "plead", "joy"];
const FACE = {
  "BrowL.rotation": 0,
  "BrowL.y": 0,
  "BrowR.rotation": 0,
  "BrowR.y": 0,
  "EyesOpen.opacity": 1,
  "EyesOpen.scale": 1,
  "EyesOpen.y": 0,
  "EyesHappy.opacity": 0,
  "MouthSmile.opacity": 1,
  "MouthGrin.opacity": 0,
  "MouthO.opacity": 0,
  "MouthFlat.opacity": 0,
  "MouthSleepy.opacity": 0,
};
const face = (name, values) => pose(`Mood ${name}`, { ...FACE, ...values });
const moodAnims = {
  neutral: face("neutral", {}),
  happy: face("happy", {
    "MouthSmile.opacity": 0,
    "MouthGrin.opacity": 1,
    "BrowL.y": -0.7,
    "BrowR.y": -0.7,
  }),
  surprised: face("surprised", {
    "EyesOpen.scale": 1.3,
    "MouthSmile.opacity": 0,
    "MouthO.opacity": 1,
    "BrowL.y": -2,
    "BrowR.y": -2,
  }),
  thinking: face("thinking", {
    "EyesOpen.y": -0.9,
    "EyesOpen.scale": 0.95,
    "MouthSmile.opacity": 0,
    "MouthFlat.opacity": 1,
    "BrowL.y": -1.3,
    "BrowL.rotation": -0.12,
    "BrowR.y": 0.3,
    "BrowR.rotation": 0.1,
  }),
  plead: face("plead", {
    "BrowL.rotation": 0.2,
    "BrowL.y": -0.9,
    "BrowR.rotation": -0.2,
    "BrowR.y": -0.9,
    "MouthSmile.opacity": 0,
    "MouthSleepy.opacity": 1,
  }),
  joy: face("joy", {
    "EyesOpen.opacity": 0,
    "EyesHappy.opacity": 1,
    "MouthSmile.opacity": 0,
    "MouthGrin.opacity": 1,
    "BrowL.y": -1,
    "BrowR.y": -1,
  }),
};

// Nods while he talks.
const nodQuiet = pose("Nod quiet", {
  "HeadReact.rotation": 0,
  "HeadReact.y": 0,
});
const nodding = anim(
  "Nodding",
  { duration: 96, loop: "loop" },
  {
    "HeadReact.rotation": [
      [0, 0],
      [24, 0.05],
      [48, -0.02],
      [72, 0.04],
      [96, 0],
    ],
    "HeadReact.y": [
      [0, 0],
      [24, 0.8],
      [48, 0],
      [72, 0.6],
      [96, 0],
    ],
  },
);

// Joystick timeline for `reach`: frame 0 leans back, the last leans in.
const reachX = anim(
  "Reach",
  { duration: 60 },
  {
    "Reach.x": [
      [0, -8, "linear"],
      [60, 6, "linear"],
    ],
    "Reach.rotation": [
      [0, -0.1, "linear"],
      [60, 0.07, "linear"],
    ],
  },
);

const blink = blinkAnim();
const { talkQuiet, talkOn } = talkAnims();
const { lookX, lookY } = lookAnims();

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

const peekLayer = layer("Peek", () => {
  const hidden = id();
  const coming = id();
  const idle = id();
  const going = id();
  const here = (v) => [cond.bool("here", v)];
  return {
    first: hidden,
    xml: [
      st(peekHidden, 160, 100, [to(coming, {}, here(true))], { id: hidden })
        .xml,
      st(
        peekIn,
        360,
        100,
        [done(idle), to(going, { duration: 120 }, here(false))],
        {
          id: coming,
        },
      ).xml,
      st(peekIdle, 560, 100, [to(going, { duration: 120 }, here(false))], {
        id: idle,
      }).xml,
      st(
        peekOut,
        360,
        260,
        [done(hidden), to(coming, { duration: 120 }, here(true))],
        {
          id: going,
        },
      ).xml,
    ],
  };
});

/** States picked from the Any State by a number: `prop` = index in `names`. */
const byNumber = (name, prop, names, anims, ms) =>
  layer(name, () => {
    const keys = names.map((k) => {
      if (!anims[k]) throw new Error(`no ${name} animation for ${k}`);
      return k;
    });
    const ids = keys.map(() => id());
    return {
      first: ids[0],
      any: keys.map((_, i) =>
        to(ids[i], { duration: ms }, [cond.number(prop, "equal", i)]),
      ),
      xml: keys.map(
        (k, i) =>
          st(anims[k], 160 + (i % 3) * 200, 100 + Math.floor(i / 3) * 140, [], {
            id: ids[i],
          }).xml,
      ),
    };
  });

const SM = id();
const stateMachine = el("StateMachine", { name: "Guide", id: SM }, [
  peekLayer,
  loopLayer("Blink", blink),
  byNumber("Mood", "mood", MOODS, moodAnims, 220),
  toggleLayer("Talk", "isTalking", talkQuiet, talkOn, [100, 160]),
  toggleLayer("Nod", "isTalking", nodQuiet, nodding, [200, 260]),
  byNumber("Gesture", "gesture", GESTURES, gestureAnims, 300),
]);

// ---------------------------------------------------------------------------
// The speech balloon: above-right of his head, its tail pointing down at him.
// ---------------------------------------------------------------------------

const guideAnims = ANIMS.splice(0);
const bubble = bubbleArtboard({
  label: "Bubble",
  size: { w: 210, h: 104 },
  stage: { x: 140, y: 0 },
  outline:
    "M20 6H190Q204 6 204 20V62Q204 76 190 76H50L24 98L34 76H20Q6 76 6 62V20Q6 6 20 6Z",
  pivot: [28, 92],
  textAt: [105, 41],
  fontSize: 12.5,
  lineHeight: 15.5,
  placeholder: "Coucou !",
});

// ---------------------------------------------------------------------------
// Document
// ---------------------------------------------------------------------------

const STYLE = id();
const doc = el("Rive", { version: 1, kind: "fragment" }, [
  el(
    "Artboard",
    {
      defaultStateMachineId: SM,
      viewModelId: VM.id,
      viewModelInstanceId: VM.inst,
      clip: "true",
      width: SIZE.w,
      height: SIZE.h,
      name: "Guide",
      styleId: STYLE,
      id: id(),
    },
    [
      el("LayoutComponentStyle", { name: "Artboard Style", id: STYLE }),
      nodeXml(scene, [0, 0]),
      el(
        "Joystick",
        {
          posX: SIZE.w / 2,
          posY: SIZE.h / 2,
          width: SIZE.w,
          height: SIZE.h,
          xId: reachX,
          name: "Reach",
        },
        [
          el("DataBindContext", {
            sourcePathIds: path("reach"),
            propertyKey: 299,
          }),
        ],
      ),
      el(
        "Joystick",
        {
          posX: SIZE.w / 2,
          posY: SIZE.h / 2,
          width: SIZE.w,
          height: SIZE.h,
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
      ...guideAnims,
    ],
  ),
  bubble.artboard,
  viewModelXml(),
  bubble.viewModel(),
  el("FontAsset", {
    file: "../avatar/fonts/NotoSans-Regular.ttf",
    name: "Noto Sans",
    id: bubble.fontId,
  }),
]);

writeProject("guide", doc, "scripts/guide-rive.mjs");
