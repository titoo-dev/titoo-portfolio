/**
 * A speech or thought bubble artboard the host types into: `typed` is what is
 * shown so far, `rest` the remainder, drawn transparent so the paragraph keeps
 * its final layout while it is written. `open` pops it up (tail parts first,
 * then the body) and lets it float; `isCode` left-aligns the text.
 */

import {
  ANIMS,
  anim,
  computeRest,
  cond,
  done,
  el,
  ellipse,
  group,
  INK,
  id,
  layer,
  line,
  n,
  nodeXml,
  paint,
  path,
  pose,
  simpleViewModel,
  st,
  to,
  toggleLayer,
} from "./kit.mjs";

/** Scalloped outline around a rounded rect, clockwise, bumps outward. */
export function cloudD(x, y, w, h, r, step) {
  const straightW = w - 2 * r;
  const straightH = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const segs = [
    { len: straightW, at: (t) => [x + r + t, y] },
    { len: arc, at: (t) => corner(x + w - r, y + r, -Math.PI / 2, t) },
    { len: straightH, at: (t) => [x + w, y + r + t] },
    { len: arc, at: (t) => corner(x + w - r, y + h - r, 0, t) },
    { len: straightW, at: (t) => [x + w - r - t, y + h] },
    { len: arc, at: (t) => corner(x + r, y + h - r, Math.PI / 2, t) },
    { len: straightH, at: (t) => [x, y + h - r - t] },
    { len: arc, at: (t) => corner(x + r, y + r, Math.PI, t) },
  ];
  function corner(cx, cy, from, t) {
    const a = from + t / r;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  const total = segs.reduce((sum, s) => sum + s.len, 0);
  const count = Math.round(total / step);
  const pointAt = (d) => {
    for (const s of segs) {
      if (d <= s.len) return s.at(d);
      d -= s.len;
    }
    return segs[0].at(0);
  };
  const pts = Array.from({ length: count }, (_, i) =>
    pointAt((i * total) / count),
  );
  const ring = [...pts, pts[0]];
  const d = ring.map(([px, py], i) => {
    if (i === 0) return `M${n(px)} ${n(py)}`;
    const [qx, qy] = ring[i - 1];
    const br = n(Math.hypot(px - qx, py - qy) / 1.7);
    return `A${br} ${br} 0 0 1 ${n(px)} ${n(py)}`;
  });
  return `${d.join("")}Z`;
}

/**
 * Builds the artboard. Call it after collecting the previous artboard's
 * animations (`ANIMS.splice(0)`): this one takes everything \`anim\` adds.
 *
 *   label        names the artboard, view model, state machine and animations
 *   size         { w, h }; stage: { x, y } on the editor's stage
 *   outline      the body's path (fill paper, faint stroke)
 *   tail         puffs [cx, cy, r] popped in order before the body (thought)
 *   extra        more outline shapes drawn with the body (a speech tail)
 *   pivot        where the body pops from
 *   textAt       the paragraph's centre; fontSize, lineHeight
 *   placeholder  shown until the view model binds
 *
 * Returns { artboard, viewModel (xml thunk), fontId } — the caller adds the
 * FontAsset root with that id.
 */
export function bubbleArtboard({
  label,
  size,
  stage,
  outline,
  tail = [],
  extra = [],
  pivot,
  textAt,
  fontSize = 12,
  lineHeight = 15,
  placeholder = "",
}) {
  const { vm: TVM, xml: viewModel } = simpleViewModel(label, [
    ["open", "boolean", false],
    ["isCode", "boolean", false],
    ["typed", "string", ""],
    ["rest", "string", ""],
    ["ink", "color", INK.ink],
    ["inkSoft", "color", INK.inkSoft],
    ["inkFaint", "color", INK.inkFaint],
    ["paper", "color", INK.paper],
  ]);
  const FONT = id();
  const bubbleLine = { vm: TVM, color: "inkFaint", w: 1.2, fill: "paper" };

  // The paragraph, centred in the body and shrink-wrapped to its longest line
  // (lines carry their own breaks). Two runs share one layout. Prose is
  // centred, code left-aligned: two texts, one shown at a time.
  const textXml = (align) => (parentPivot) => {
    const typedStyle = id();
    const ghostStyle = id();
    const style = (name, sid, fill) =>
      el(
        "TextStylePaint",
        { fontSize, lineHeight, fontAssetId: FONT, name, id: sid },
        [fill],
      );
    const run = (name, sid, prop, text) =>
      el("TextValueRun", { styleId: sid, text, name }, [
        el("DataBindContext", {
          sourcePathIds: path(prop, TVM),
          propertyKey: 268,
        }),
      ]);
    return el(
      "Text",
      {
        x: textAt[0] - parentPivot[0],
        y: textAt[1] - parentPivot[1],
        originX: 0.5,
        originY: 0.5,
        sizingValue: "autoWidth",
        alignValue: align,
        wrapValue: "noWrap",
        name: label,
        id: id(),
      },
      [
        style("Typed", typedStyle, paint("Fill", "ink", {}, [], TVM)),
        style(
          "Ghost",
          ghostStyle,
          el("Fill", { name: "Fill" }, [
            el("SolidColor", { colorValue: "00000000", name: "Color" }),
          ]),
        ),
        run("Typed", typedStyle, "typed", ""),
        run("Rest", ghostStyle, "rest", placeholder),
      ],
    );
  };

  // Back-to-front.
  const puff = (i, [cx, cy, r]) =>
    group(`Puff${i}`, [cx, cy], [ellipse(cx, cy, r, r, bubbleLine)], {
      opacity: 0,
    });
  const scene = group(
    `${label}Scene`,
    [0, 0],
    [
      ...tail.map((p, i) => puff(i + 1, p)),
      group(
        "Bubble",
        pivot,
        [
          group("BubbleBob", pivot, [
            line(outline, bubbleLine),
            ...extra.map((d) => line(d, bubbleLine)),
            group("IdeaText", textAt, [
              { kind: "raw", xml: textXml("center") },
            ]),
            group("CodeText", textAt, [{ kind: "raw", xml: textXml("left") }], {
              opacity: 0,
            }),
          ]),
        ],
        { opacity: 0 },
      ),
    ],
  );
  computeRest(scene, [0, 0]);

  const PUFFS = tail.map((_, i) => `Puff${i + 1}`);
  const closed = pose(`${label} closed`, {
    "Bubble.opacity": 0,
    "Bubble.scale": 0.7,
    "BubbleBob.y": 0,
    ...Object.fromEntries(PUFFS.flatMap((p) => [[`${p}.opacity`, 0]])),
    ...Object.fromEntries(PUFFS.map((p) => [`${p}.scale`, 0.3])),
  });
  const open = anim(
    `${label} open`,
    { duration: 40 },
    {
      ...Object.fromEntries(
        PUFFS.flatMap((p, i) => [
          [
            `${p}.opacity`,
            [
              [0, 0, "hold"],
              [i * 6 + 2, 0],
              [i * 6 + 2 + 5, 1, "hold"],
            ],
          ],
          [
            `${p}.scale`,
            [
              [0, 0.3, "hold"],
              [i * 6 + 2, 0.3],
              [i * 6 + 2 + 6, 1.15],
              [i * 6 + 2 + 10, 1, "hold"],
            ],
          ],
        ]),
      ),
      "Bubble.opacity": [
        [0, 0, "hold"],
        [14, 0],
        [22, 1, "hold"],
      ],
      "Bubble.scale": [
        [0, 0.7, "hold"],
        [14, 0.7],
        [30, 1.05],
        [40, 1, "hold"],
      ],
      "BubbleBob.y": [[0, 0, "hold"]],
    },
  );
  const float = anim(
    `${label} float`,
    { duration: 150, loop: "pingPong" },
    {
      "BubbleBob.y": [
        [0, 0],
        [150, -1.6],
      ],
      "Bubble.opacity": [[0, 1, "hold"]],
      "Bubble.scale": [[0, 1, "hold"]],
      ...Object.fromEntries(
        PUFFS.flatMap((p) => [
          [`${p}.opacity`, [[0, 1, "hold"]]],
          [`${p}.scale`, [[0, 1, "hold"]]],
        ]),
      ),
    },
  );
  const close = anim(
    `${label} close`,
    { duration: 20 },
    {
      "Bubble.opacity": [
        [0, 1],
        [14, 0, "hold"],
      ],
      "Bubble.scale": [
        [0, 1],
        [14, 0.92, "hold"],
      ],
      ...Object.fromEntries(
        PUFFS.flatMap((p, i) => [
          [
            `${p}.opacity`,
            [
              [0, 1, "hold"],
              [8 - i * 3, 1],
              [14 - i * 3, 0, "hold"],
            ],
          ],
          [`${p}.scale`, [[0, 1, "hold"]]],
        ]),
      ),
    },
  );

  const bubbleLayer = layer("Bubble", () => {
    const closedId = id();
    const opening = id();
    const floating = id();
    const closing = id();
    const isOpen = (v) => [cond.bool("open", v, TVM)];
    return {
      first: closedId,
      xml: [
        st(closed, 160, 100, [to(opening, {}, isOpen(true))], {
          id: closedId,
        }).xml,
        st(
          open,
          360,
          100,
          [done(floating), to(closing, { duration: 80 }, isOpen(false))],
          { id: opening },
        ).xml,
        st(float, 560, 100, [to(closing, { duration: 80 }, isOpen(false))], {
          id: floating,
        }).xml,
        st(
          close,
          360,
          260,
          [done(closedId), to(opening, { duration: 80 }, isOpen(true))],
          { id: closing },
        ).xml,
      ],
    };
  });

  const ideaShown = pose("Idea text", {
    "IdeaText.opacity": 1,
    "CodeText.opacity": 0,
  });
  const codeShown = pose("Code text", {
    "IdeaText.opacity": 0,
    "CodeText.opacity": 1,
  });

  const SM = id();
  const stateMachine = el("StateMachine", { name: label, id: SM }, [
    bubbleLayer,
    toggleLayer("Kind", "isCode", ideaShown, codeShown, [0, 0], TVM),
  ]);
  const anims = ANIMS.splice(0);
  const STYLE = id();

  const artboard = el(
    "Artboard",
    {
      defaultStateMachineId: SM,
      viewModelId: TVM.id,
      viewModelInstanceId: TVM.inst,
      x: stage.x,
      y: stage.y,
      width: size.w,
      height: size.h,
      name: label,
      styleId: STYLE,
      id: id(),
    },
    [
      el("LayoutComponentStyle", { name: "Artboard Style", id: STYLE }),
      nodeXml(scene, [0, 0]),
      stateMachine,
      ...anims,
    ],
  );
  return { artboard, viewModel, fontId: FONT };
}
