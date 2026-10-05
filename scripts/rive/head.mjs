/**
 * The avatar's head (hair, face, glasses, eyes, brows, mouths), shared by every
 * Rive file of the character, in the coordinates of the 120x120 avatar
 * (components/motion/coder-avatar.tsx). Parts are registered by name for
 * keying: animations below drive blinking, talking and looking around.
 */

import { anim, el, ellipse, group, line, pose } from "./kit.mjs";

const HAIR_PTS = [
  [44.5, 49],
  [43.3, 42],
  [45, 35],
  [48.5, 28.5],
  [54, 24],
  [60.5, 22.5],
  [67, 23.5],
  [72.5, 28],
  [76, 34.5],
  [77, 42],
  [75.5, 49],
];
const hairD = HAIR_PTS.map(([x, y], i) => {
  if (i === 0) return `M${x} ${y}`;
  const [px, py] = HAIR_PTS[i - 1];
  const r = Math.hypot(x - px, y - py) / 1.7;
  return `A${r} ${r} 0 0 1 ${x} ${y}`;
}).join("");

/** Jaw line, from the left temple down to the chin and up to the right. */
const FACE = "M44.5 47C44.5 62 50 73.5 60 75.5C70 73.5 75.5 62 75.5 47";

export const GRIN =
  "M56 66.6Q60 67 64 66.4Q63.2 70.6 60 70.7Q56.8 70.6 56 66.6Z";
export const HAPPY_EYES =
  "M50 53.4Q52.5 50.6 55 53.4M65 53.4Q67.5 50.6 70 53.4";
export const faint = { color: "inkFaint", w: 1.1 };
export const soft = { color: "inkSoft" };

/** Builds the head: `HeadMood` > `HeadReact` > ... > `HeadLook`, pivot (60, 76). */
export function buildHead() {
  const eyesOpen = group(
    "EyesOpen",
    [60, 52.4],
    [
      group(
        "EyeL",
        [52.5, 52.4],
        [
          group(
            "EyeLBlink",
            [52.5, 52.4],
            [ellipse(52.5, 52.4, 0.9, 0.9, { w: 1.7 })],
          ),
        ],
      ),
      group(
        "EyeR",
        [67.5, 52.4],
        [
          group(
            "EyeRBlink",
            [67.5, 52.4],
            [ellipse(67.5, 52.4, 0.9, 0.9, { w: 1.7 })],
          ),
        ],
      ),
    ],
  );

  const eyes = group(
    "EyesReactGate",
    [60, 52.4],
    [
      group(
        "EyesRoll",
        [60, 52.4],
        // EyesDown: glancing at the screen while coding.
        [group("EyesDown", [60, 52.4], [eyesOpen])],
      ),
      line(HAPPY_EYES, { name: "EyesHappy", opacity: 0 }),
      line("M50 52.6Q52.5 54.6 55 52.6M65 52.6Q67.5 54.6 70 52.6", {
        name: "EyesClosed",
        opacity: 0,
      }),
    ],
  );

  const mouths = group(
    "MouthsTalkGate",
    [60, 68],
    [
      group(
        "MouthsReactGate",
        [60, 68],
        [
          line("M56.6 67.4Q60 69.8 63.4 67.2", { name: "MouthSmile" }),
          line(GRIN, { name: "MouthGrin", opacity: 0 }),
          ellipse(60, 68.4, 1.5, 1.9, { name: "MouthO", opacity: 0 }),
          line("M57 68.2Q58.5 67.4 60 68.2Q61.5 69 63 68.2", {
            name: "MouthFlat",
            opacity: 0,
          }),
          line("M57 68.8Q60.5 69 63.4 66.8", {
            name: "MouthSmirk",
            opacity: 0,
          }),
          line("M58.4 68.4Q60 69.1 61.6 68.4", {
            name: "MouthSleepy",
            opacity: 0,
          }),
        ],
      ),
    ],
  );

  const features = group(
    "Features",
    [60, 55],
    [
      group(
        "FeaturesMood",
        [60, 55],
        [
          line("M56 71.2C57.5 74.6 62.5 74.6 64 71.2"),
          line("M54.4 64.8C56.5 63 63.5 63 65.6 64.8"),
          mouths,
          group(
            "MouthTalk",
            [60, 68.4],
            [
              group(
                "MouthTalkScale",
                [60, 68.4],
                [ellipse(60, 68.4, 2.3, 1.8)],
              ),
            ],
            { opacity: 0 },
          ),
          line(GRIN, { name: "MouthReactGrin", opacity: 0 }),
          line("M57 68.4H63", { name: "MouthReactFlat", opacity: 0 }),
          line("M60 54.5Q58.8 59.5 57.4 60.8Q60 62.2 62.6 60.8", soft),
          eyes,
          line(HAPPY_EYES, { name: "EyesReactHappy", opacity: 0 }),
          // glasses on top of the eyes
          ellipse(52.5, 52, 6.2, 6.2),
          ellipse(67.5, 52, 6.2, 6.2),
          line("M58.7 51.2Q60 49.8 61.3 51.2M46.3 51L44 50.3M73.7 51L76 50.3"),
          line("M48.9 49.8l2.3-2.3M63.9 49.8l2.3-2.3", {
            ...soft,
            w: 1.1,
            name: "Glint",
            opacity: 0,
          }),
          group(
            "BrowsHover",
            [60, 45],
            [
              group("BrowL", [52.5, 44.6], [line("M48 45.4Q52.5 43.4 57 45")]),
              group("BrowR", [67.5, 44.6], [line("M63 45Q67.5 43.4 72 45.4")]),
            ],
          ),
        ],
      ),
    ],
  );

  const head = group(
    "HeadMood",
    [60, 76],
    [
      group(
        "HeadReact",
        [60, 76],
        [
          group(
            "HeadHover",
            [60, 76],
            [
              group(
                "HeadCode",
                [60, 76],
                [
                  group(
                    "HeadLook",
                    [60, 76],
                    [
                      // Paper behind the face and ears, so the head stays
                      // solid over whatever is behind the canvas (the sky).
                      line(
                        `${FACE}C72.5 40.5 67 38.5 60 38.5C53 38.5 47.5 40.5 44.5 47Z`,
                        {
                          fill: "paper",
                          w: 0,
                        },
                      ),
                      line(
                        "M44.2 51C41 50 39.6 52 39.9 55.2C40.2 58.4 42 60 44.6 59.4ZM75.8 51C79 50 80.4 52 80.1 55.2C79.8 58.4 78 60 75.4 59.4Z",
                        { fill: "paper", w: 0 },
                      ),
                      line(
                        "M44.2 51C41 50 39.6 52 39.9 55.2C40.2 58.4 42 60 44.6 59.4",
                      ),
                      line(
                        "M75.8 51C79 50 80.4 52 80.1 55.2C79.8 58.4 78 60 75.4 59.4",
                      ),
                      line(FACE),
                      line(
                        "M46.5 60C48 67.5 53 72 60 72.8C67 72 72 67.5 73.5 60",
                        {
                          ...soft,
                          w: 1.2,
                          effects: [
                            el("DashPath", { name: "Dots" }, [
                              el("Dash", { length: 0.05 }),
                              el("Dash", { length: 2.4 }),
                            ]),
                          ],
                        },
                      ),
                      group(
                        "Hair",
                        [60, 38],
                        [
                          line(
                            `${hairD}L75.5 47C72.5 40.5 67 38.5 60 38.5C53 38.5 47.5 40.5 44.5 47Z`,
                            { fill: "paper", w: 0 },
                          ),
                          line(hairD),
                          line(
                            "M44.5 47C47.5 40.5 53 38.5 60 38.5C67 38.5 72.5 40.5 75.5 47",
                          ),
                          line(
                            "M50 31.5a2.6 2.6 0 0 1 4.4 1M58 27.5a2.6 2.6 0 0 1 4.6.4M66 30a2.6 2.6 0 0 1 4.2 1.8M47 38a2.4 2.4 0 0 1 3.6-1.4M71 36.6a2.4 2.4 0 0 1 3.4 1.6",
                            { ...soft, w: 1.1 },
                          ),
                        ],
                      ),
                      features,
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
  return head;
}

/** Swap the mood's eyes/mouth for a grin + happy eyes between two frames. */
export const joyful = (from, to) => ({
  "EyesReactGate.opacity": [
    [0, 1, "linear"],
    [from, 0, "hold"],
    [to, 0, "linear"],
    [to + 4, 1],
  ],
  "EyesReactHappy.opacity": [
    [0, 0, "linear"],
    [from, 1, "hold"],
    [to, 1, "linear"],
    [to + 4, 0],
  ],
  "MouthsReactGate.opacity": [
    [0, 1, "linear"],
    [from, 0, "hold"],
    [to, 0, "linear"],
    [to + 4, 1],
  ],
  "MouthReactGrin.opacity": [
    [0, 0, "linear"],
    [from, 1, "hold"],
    [to, 1, "linear"],
    [to + 4, 0],
  ],
});

export const blinkAnim = () =>
  anim(
    "Blink",
    { duration: 240, loop: "loop" },
    {
      "EyeLBlink.scaleY": [
        [0, 1, "hold"],
        [144, 1, "linear"],
        [149, 0.1, "linear"],
        [155, 1, "hold"],
        [240, 1, "hold"],
      ],
      "EyeRBlink.scaleY": [
        [0, 1, "hold"],
        [144, 1, "linear"],
        [149, 0.1, "linear"],
        [155, 1, "hold"],
        [240, 1, "hold"],
      ],
    },
  );

export function talkAnims() {
  const talkQuiet = pose("Talk quiet", {
    "MouthsTalkGate.opacity": 1,
    "MouthTalk.opacity": 0,
    "MouthTalkScale.scaleY": 0.35,
  });
  const talkOn = anim(
    "Talking",
    { duration: 48, loop: "loop" },
    {
      "MouthsTalkGate.opacity": [[0, 0, "hold"]],
      "MouthTalk.opacity": [[0, 1, "hold"]],
      "MouthTalkScale.scaleY": [
        [0, 0.35],
        [6, 1],
        [12, 0.5],
        [18, 0.9],
        [24, 0.3],
        [32, 1],
        [40, 0.45],
        [48, 0.35],
      ],
    },
  );
  return { talkQuiet, talkOn };
}

/** Joystick timelines: -1 is frame 0 (left / top), 1 the last frame. */
export function lookAnims() {
  const lookX = anim(
    "Look X",
    { duration: 60 },
    {
      "HeadLook.x": [
        [0, -1.2, "linear"],
        [60, 1.2, "linear"],
      ],
      "Features.x": [
        [0, -1.8, "linear"],
        [60, 1.8, "linear"],
      ],
      "Hair.x": [
        [0, -0.7, "linear"],
        [60, 0.7, "linear"],
      ],
    },
  );
  const lookY = anim(
    "Look Y",
    { duration: 60 },
    {
      "HeadLook.y": [
        [0, -0.6, "linear"],
        [60, 0.6, "linear"],
      ],
      "Features.y": [
        [0, -1.4, "linear"],
        [60, 1.4, "linear"],
      ],
      "Hair.y": [
        [0, -0.4, "linear"],
        [60, 0.4, "linear"],
      ],
    },
  );
  return { lookX, lookY };
}
