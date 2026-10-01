/**
 * Generates the interactive Rive avatar from code, then builds it.
 *
 *   rive/avatar/scene.rml  <- generated here (do not hand-edit)
 *   public/avatar.riv      <- built with the Rive CLI (`rive <dir> --once`)
 *
 * The art mirrors components/motion/coder-avatar.tsx (line art, 120x120) and
 * is written as SVG path strings, converted to Rive vertices below. Everything
 * is driven by the `Avatar` view model so the host (and later the chat) can
 * steer it: `mood`, `humor`, `lookX/lookY`, `isTalking`, `isTyping` (coding:
 * head down, key taps; paused on hover and while talking), and the
 * triggers `wave`, `poke`, `solve`, `celebrate`.
 *
 * Usage: pnpm avatar
 */

import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT = join(ROOT, "rive", "avatar");

// ---------------------------------------------------------------------------
// Ids, numbers, xml
// ---------------------------------------------------------------------------

let nextId = 10;
const id = () => `0:${nextId++}`;
const n = (v) => {
  const r = Math.round(v * 10000) / 10000;
  return Object.is(r, -0) ? "0" : String(r);
};
const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${typeof v === "number" ? n(v) : v}"`)
    .join(" ");
const el = (tag, a = {}, children = []) => {
  const inner = children.flat(Infinity).filter(Boolean);
  const open = `<${tag}${Object.keys(a).length ? ` ${attrs(a)}` : ""}`;
  return inner.length ? `${open}>${inner.join("")}</${tag}>` : `${open}/>`;
};

// ---------------------------------------------------------------------------
// SVG path -> subpaths of cubic/line segments
// ---------------------------------------------------------------------------

function arcToCubics([x1, y1], rx, ry, phiDeg, fa, fs, [x2, y2]) {
  const phi = (phiDeg * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const coef = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => {
    const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    return a;
  };
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang(
    (x1p - cxp) / rx,
    (y1p - cyp) / ry,
    (-x1p - cxp) / rx,
    (-y1p - cyp) / ry,
  );
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  const parts = Math.ceil(Math.abs(dt) / (Math.PI / 2));
  const step = dt / parts;
  const k = (4 / 3) * Math.tan(step / 4);
  const pt = (t) => [
    cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin,
    cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos,
  ];
  const der = (t) => [
    -rx * Math.sin(t) * cos - ry * Math.cos(t) * sin,
    -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos,
  ];
  const segs = [];
  for (let i = 0; i < parts; i++) {
    const a = t1 + i * step;
    const b = a + step;
    const p0 = pt(a);
    const p3 = pt(b);
    const d0 = der(a);
    const d3 = der(b);
    segs.push({
      c1: [p0[0] + k * d0[0], p0[1] + k * d0[1]],
      c2: [p3[0] - k * d3[0], p3[1] - k * d3[1]],
      p: p3,
    });
  }
  return segs;
}

function parsePath(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/g);
  const subs = [];
  let cur = null;
  let pos = [0, 0];
  let start = [0, 0];
  let i = 0;
  let cmd = "";
  const num = () => Number.parseFloat(toks[i++]);
  const isNum = () => i < toks.length && !/^[a-zA-Z]$/.test(toks[i]);
  while (i < toks.length) {
    if (/^[a-zA-Z]$/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const abs = (x, y) => (rel ? [pos[0] + x, pos[1] + y] : [x, y]);
    if (C === "M") {
      pos = abs(num(), num());
      start = pos;
      cur = { start: pos, segs: [], closed: false };
      subs.push(cur);
      cmd = rel ? "l" : "L";
    } else if (C === "Z") {
      cur.closed = true;
      pos = start;
      continue;
    } else if (C === "L") {
      pos = abs(num(), num());
      cur.segs.push({ p: pos });
    } else if (C === "H") {
      const x = num();
      pos = [rel ? pos[0] + x : x, pos[1]];
      cur.segs.push({ p: pos });
    } else if (C === "V") {
      const y = num();
      pos = [pos[0], rel ? pos[1] + y : y];
      cur.segs.push({ p: pos });
    } else if (C === "C") {
      const c1 = abs(num(), num());
      const c2 = abs(num(), num());
      pos = abs(num(), num());
      cur.segs.push({ c1, c2, p: pos });
    } else if (C === "Q") {
      const q = abs(num(), num());
      const p = abs(num(), num());
      const p0 = pos;
      cur.segs.push({
        c1: [
          p0[0] + (2 / 3) * (q[0] - p0[0]),
          p0[1] + (2 / 3) * (q[1] - p0[1]),
        ],
        c2: [p[0] + (2 / 3) * (q[0] - p[0]), p[1] + (2 / 3) * (q[1] - p[1])],
        p,
      });
      pos = p;
    } else if (C === "A") {
      const rx = num();
      const ry = num();
      const phi = num();
      const fa = num();
      const fs = num();
      const p = abs(num(), num());
      cur.segs.push(...arcToCubics(pos, rx, ry, phi, fa, fs, p));
      pos = p;
    } else {
      throw new Error(`unsupported path command ${cmd} in ${d}`);
    }
    if (!isNum() && i < toks.length && !/^[a-zA-Z]$/.test(toks[i])) break;
  }
  return subs;
}

const near = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-3;

/** One PointsPath per subpath, vertices relative to `origin`. */
function pointsPaths(d, origin) {
  return parsePath(d).map((sub) => {
    const pts = [sub.start, ...sub.segs.map((s) => s.p)];
    const segs = [...sub.segs];
    let closed = sub.closed;
    if (near(pts[0], pts[pts.length - 1]) && pts.length > 2) {
      pts.pop();
      closed = true;
    }
    const verts = pts.map((p, vi) => {
      const inSeg =
        vi > 0 ? segs[vi - 1] : closed ? segs[segs.length - 1] : null;
      const outSeg = vi < segs.length ? segs[vi] : null;
      const inH = inSeg?.c2;
      const outH =
        outSeg && !(closed && vi === pts.length && outSeg)
          ? outSeg.c1
          : undefined;
      const x = p[0] - origin[0];
      const y = p[1] - origin[1];
      if (!inH && !outH) return el("StraightVertex", { x, y });
      const pol = (h) =>
        h
          ? [
              Math.atan2(h[1] - p[1], h[0] - p[0]),
              Math.hypot(h[0] - p[0], h[1] - p[1]),
            ]
          : [0, 0];
      const [ir, idist] = pol(inH);
      const [or, odist] = pol(outH);
      return el("CubicDetachedVertex", {
        x,
        y,
        inRotation: ir,
        inDistance: idist,
        outRotation: or,
        outDistance: odist,
      });
    });
    return el(
      "PointsPath",
      { isClosed: closed ? "true" : "false", name: "Path" },
      verts,
    );
  });
}

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
const path = (prop, vm = VM) => `${vm.id}-${vm.props[prop]}`;

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

// ---------------------------------------------------------------------------
// Scene tree. Children are listed back-to-front (like SVG) and reversed on
// output, since Rive draws the first sibling on top.
// ---------------------------------------------------------------------------

const REG = {}; // name -> node (for keying)
REG.Trim = { id: id() }; // the typing line's TrimPath

function group(name, pivot, children, opts = {}) {
  const node = { kind: "node", name, pivot, children, id: id(), ...opts };
  REG[name] = node;
  return node;
}

const INK = {
  ink: "FF171717",
  inkSoft: "FF666666",
  inkFaint: "FFD6D6D6",
  paper: "FFFFFFFF",
};

function paint(kind, color, extra = {}, children = [], vm = VM) {
  return el(kind, { name: kind, ...extra }, [
    el("SolidColor", { colorValue: INK[color], name: "Color" }, [
      el("DataBindContext", {
        sourcePathIds: path(color, vm),
        propertyKey: 37,
      }),
    ]),
    ...children,
  ]);
}

const stroke = (color = "ink", w = 1.4, children = [], vm = VM) =>
  paint(
    "Stroke",
    color,
    { thickness: w, cap: "round", join: "round" },
    children,
    vm,
  );

/** A stroked path shape. `opts.name` registers it for keying. */
const named = (s) => {
  if (s.name) REG[s.name] = s;
  return s;
};
function line(d, opts = {}) {
  return named({ kind: "path", d, color: "ink", w: 1.4, id: id(), ...opts });
}
function ellipse(cx, cy, rx, ry, opts = {}) {
  return named({
    kind: "ellipse",
    cx,
    cy,
    rx,
    ry,
    color: "ink",
    w: 1.4,
    id: id(),
    ...opts,
  });
}
function rect(x, y, w, h, r, opts = {}) {
  return named({
    kind: "rect",
    x,
    y,
    wd: w,
    ht: h,
    r,
    color: "ink",
    w: 1.4,
    id: id(),
    ...opts,
  });
}

/** Rest positions, relative to the parent pivot (keyframes offset from them). */
function computeRest(node, parentPivot) {
  node.rest = {
    x: node.pivot[0] - parentPivot[0],
    y: node.pivot[1] - parentPivot[1],
  };
  for (const c of node.children) {
    if (c.kind === "node") computeRest(c, node.pivot);
    else if (c.kind === "path" || c.kind === "raw") c.rest = { x: 0, y: 0 };
    else {
      const cx = c.kind === "ellipse" ? c.cx : c.x + c.wd / 2;
      const cy = c.kind === "ellipse" ? c.cy : c.y + c.ht / 2;
      c.rest = { x: cx - node.pivot[0], y: cy - node.pivot[1] };
    }
  }
}

function shapeXml(s, parentPivot) {
  const paints = [];
  if (s.fill) paints.push(paint("Fill", s.fill, {}, [], s.vm));
  if (s.w > 0) paints.push(stroke(s.color, s.w, s.effects ?? [], s.vm));
  // Fill first, crisp stroke last: later paints draw on top within a shape.
  if (s.kind === "path") {
    return el(
      "Shape",
      { x: 0, y: 0, opacity: s.opacity, name: s.name ?? "Line", id: s.id },
      [...pointsPaths(s.d, parentPivot), ...paints],
    );
  }
  const cx = s.kind === "ellipse" ? s.cx : s.x + s.wd / 2;
  const cy = s.kind === "ellipse" ? s.cy : s.y + s.ht / 2;
  const rest = { x: cx - parentPivot[0], y: cy - parentPivot[1] };
  const geo =
    s.kind === "ellipse"
      ? el("Ellipse", { width: s.rx * 2, height: s.ry * 2, name: "Path" })
      : el("Rectangle", {
          width: s.wd,
          height: s.ht,
          cornerRadiusTL: s.r,
          name: "Path",
        });
  return el(
    "Shape",
    { ...rest, opacity: s.opacity, name: s.name ?? "Shape", id: s.id },
    [geo, ...paints],
  );
}

function nodeXml(node, parentPivot) {
  const rest = {
    x: node.pivot[0] - parentPivot[0],
    y: node.pivot[1] - parentPivot[1],
  };
  const kids = [...node.children]
    .reverse()
    .map((c) =>
      c.kind === "node"
        ? nodeXml(c, node.pivot)
        : c.kind === "raw"
          ? c.xml(node.pivot)
          : shapeXml(c, node.pivot),
    );
  return el(
    "Node",
    {
      ...rest,
      opacity: node.opacity,
      scaleX: node.scale,
      scaleY: node.scale,
      name: node.name,
      id: node.id,
    },
    kids,
  );
}

// ---------------------------------------------------------------------------
// The art (120x120, same coordinates as coder-avatar.tsx)
// ---------------------------------------------------------------------------

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

const GRIN = "M56 66.6Q60 67 64 66.4Q63.2 70.6 60 70.7Q56.8 70.6 56 66.6Z";
const HAPPY_EYES = "M50 53.4Q52.5 50.6 55 53.4M65 53.4Q67.5 50.6 70 53.4";
const faint = { color: "inkFaint", w: 1.1 };
const soft = { color: "inkSoft" };

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
        line("M57 68.8Q60.5 69 63.4 66.8", { name: "MouthSmirk", opacity: 0 }),
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
          [group("MouthTalkScale", [60, 68.4], [ellipse(60, 68.4, 2.3, 1.8)])],
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
                    line(
                      "M44.2 51C41 50 39.6 52 39.9 55.2C40.2 58.4 42 60 44.6 59.4",
                    ),
                    line(
                      "M75.8 51C79 50 80.4 52 80.1 55.2C79.8 58.4 78 60 75.4 59.4",
                    ),
                    line(
                      "M44.5 47C44.5 62 50 73.5 60 75.5C70 73.5 75.5 62 75.5 47",
                    ),
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

const KEY = {
  x: 13,
  y: 14,
  rotation: 15,
  scaleX: 16,
  scaleY: 17,
  opacity: 18,
  end: 115,
};
const EASE = el("CubicEaseInterpolator", { x1: 0.42, y1: 0, x2: 0.58, y2: 1 });

const ANIMS = [];

/**
 * tracks: { "Target.prop": [[frame, value, interp?], ...] }
 * x/y values are offsets from the target's rest position.
 * interp: "ease" (default) | "linear" | "hold"
 */
function anim(name, { duration = 1, loop = "oneShot" } = {}, tracks = {}) {
  const aid = id();
  const byObj = {};
  for (const [k, frames] of Object.entries(tracks)) {
    const [target, prop] = k.split(".");
    const obj = REG[target];
    if (!obj) throw new Error(`unknown target ${target}`);
    const props = prop === "scale" ? ["scaleX", "scaleY"] : [prop];
    for (const p of props) {
      byObj[obj.id] ??= [];
      byObj[obj.id].push(
        el(
          "KeyedProperty",
          { propertyKey: KEY[p] },
          frames.map(([frame, value, interp = "ease"]) => {
            const v =
              p === "x" || p === "y" ? value + (obj.rest?.[p] ?? 0) : value;
            return el(
              "KeyFrameDouble",
              {
                value: v,
                frame,
                interpolationType: interp === "ease" ? "cubic" : interp,
              },
              interp === "ease" ? [EASE] : [],
            );
          }),
        ),
      );
    }
  }
  ANIMS.push(
    el(
      "LinearAnimation",
      { loopValue: loop, fps: 60, duration, name, id: aid },
      Object.entries(byObj).map(([objectId, kps]) =>
        el("KeyedObject", { objectId }, kps),
      ),
    ),
  );
  return aid;
}

/** A one-frame pose: every listed property held at a value. */
const pose = (name, values, extra = {}) =>
  anim(
    name,
    { duration: extra.duration ?? 1, loop: extra.loop ?? "oneShot" },
    {
      ...Object.fromEntries(
        Object.entries(values).map(([k, v]) => [k, [[0, v, "hold"]]]),
      ),
      ...(extra.tracks ?? {}),
    },
  );

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

/** Swap the mood's eyes/mouth for a grin + happy eyes between two frames. */
const joyful = (from, to) => ({
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

const blink = anim(
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

// Joystick timelines: -1 is frame 0 (left / top), 1 the last frame.
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

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

const bindable = (type, prop, extra = {}) => {
  const key = { Boolean: 634, Number: 636, Enum: 637, Trigger: 686 }[type];
  return el(
    `BindableProperty${type}`,
    extra.value !== undefined ? { propertyValue: extra.value } : {},
    [
      el("DataBindContext", {
        sourcePathIds: path(prop, extra.vm),
        propertyKey: key,
        direction: extra.write ? "true" : undefined,
      }),
    ],
  );
};

const cond = {
  bool: (prop, value, vm) =>
    el("TransitionViewModelCondition", {}, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Boolean", prop, { vm }),
      ]),
      el("TransitionValueBooleanComparator", { value: String(value) }),
    ]),
  trigger: (prop) =>
    el("TransitionViewModelCondition", {}, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Trigger", prop),
      ]),
      el("TransitionValueTriggerComparator"),
    ]),
  mood: (m) =>
    el("TransitionViewModelCondition", {}, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Enum", "mood"),
      ]),
      el("TransitionValueEnumComparator", { value: VM.moodIds[m] }),
    ]),
  number: (prop, op, value) =>
    el("TransitionViewModelCondition", { opValue: op }, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Number", prop),
      ]),
      el("TransitionValueNumberComparator", { value }),
    ]),
};

const to = (stateId, extra = {}, conditions = []) =>
  el("StateTransition", { stateToId: stateId, ...extra }, conditions);
const done = (stateId) =>
  to(stateId, {
    enableExitTime: "true",
    exitTimeIsPercetange: "true",
    exitTime: 100,
    duration: 160,
  });

function layer(name, build) {
  const states = build();
  return el("StateMachineLayer", { name, id: id() }, [
    el("AnyState", { x: 640, y: -120 }, states.any ?? []),
    el("ExitState", { x: 840, y: -120 }),
    el("EntryState", { x: 0, y: 100 }, [to(states.first)]),
    ...states.xml,
  ]);
}

const st = (animationId, x, y, transitions = [], extra = {}) => {
  const sid = extra.id ?? id();
  return {
    id: sid,
    xml: el(
      "AnimationState",
      { x, y, animationId, id: sid, ...extra.attrs },
      transitions,
    ),
  };
};

// Simple two-state toggle on a boolean.
function toggleLayer(name, prop, offAnim, onAnim, ms = [200, 200], vm = VM) {
  return layer(name, () => {
    const offId = id();
    const onId = id();
    return {
      first: offId,
      xml: [
        st(
          offAnim,
          160,
          100,
          [to(onId, { duration: ms[0] }, [cond.bool(prop, true, vm)])],
          { id: offId },
        ).xml,
        st(
          onAnim,
          360,
          100,
          [to(offId, { duration: ms[1] }, [cond.bool(prop, false, vm)])],
          { id: onId },
        ).xml,
      ],
    };
  });
}

const loopLayer = (name, animId) =>
  layer(name, () => {
    const s = st(animId, 160, 100);
    return { first: s.id, xml: [s.xml] };
  });

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
    any: MOODS.map((m) => to(ids[m], { duration: 260 }, [cond.mood(m)])),
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

const listener = (target, type, actions, name) =>
  el(
    "StateMachineListenerSingle",
    { targetId: REG[target].id, listenerTypeValue: type, name },
    actions,
  );
const writeBool = (prop, value) =>
  el("ListenerViewModelChange", {}, [
    bindable("Boolean", prop, { value: String(value), write: true }),
  ]);
const fire = (prop) =>
  el("ListenerViewModelChange", {}, [
    bindable("Trigger", prop, { value: 1, write: true }),
  ]);

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
// (the box itself is too small for legible text). The host types a thought
// into it: `typed` is what is shown so far, `rest` the remainder, drawn
// transparent so the paragraph keeps its final layout while it is written.
// ---------------------------------------------------------------------------

const avatarAnims = ANIMS.splice(0);

const TVM = { id: id(), inst: id(), props: {} };
const TPROPS = [
  ["open", "boolean", false],
  ["isCode", "boolean", false],
  ["typed", "string", ""],
  ["rest", "string", ""],
  ["ink", "color", INK.ink],
  ["inkSoft", "color", INK.inkSoft],
  ["inkFaint", "color", INK.inkFaint],
  ["paper", "color", INK.paper],
];
for (const [name] of TPROPS) TVM.props[name] = id();

function thoughtViewModelXml() {
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  return el(
    "ViewModel",
    { defaultInstanceId: TVM.inst, name: "Thought", id: TVM.id },
    [
      ...TPROPS.map(([name, type]) =>
        el(`ViewModelProperty${cap(type)}`, { name, id: TVM.props[name] }),
      ),
      el(
        "ViewModelInstance",
        { exports: "true", name: "Default", id: TVM.inst },
        TPROPS.map(([name, type, value]) =>
          el(`ViewModelInstance${cap(type)}`, {
            propertyValue: typeof value === "boolean" ? String(value) : value,
            viewModelPropertyId: TVM.props[name],
          }),
        ),
      ),
    ],
  );
}

const THOUGHT = { w: 240, h: 120 };
const FONT = id();

/** Scalloped outline around a rounded rect, clockwise, bumps outward. */
function cloudD(x, y, w, h, r, step) {
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

const tv = { vm: TVM };
const bubbleLine = { ...tv, color: "inkFaint", w: 1.2, fill: "paper" };

// The paragraph, centred in the cloud and shrink-wrapped to its longest line
// (thoughts carry their own line breaks). Two runs share one layout. Ideas
// are centred, code is left-aligned: two texts, one shown at a time.
const TEXT_AT = [120, 44];
const textXml = (align) => (pivot) => {
  const typedStyle = id();
  const ghostStyle = id();
  const style = (name, sid, fill) =>
    el(
      "TextStylePaint",
      {
        fontSize: 12,
        lineHeight: 15,
        fontAssetId: FONT,
        name,
        id: sid,
      },
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
      x: TEXT_AT[0] - pivot[0],
      y: TEXT_AT[1] - pivot[1],
      originX: 0.5,
      originY: 0.5,
      sizingValue: "autoWidth",
      alignValue: align,
      wrapValue: "noWrap",
      name: "Thought",
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
      run("Rest", ghostStyle, "rest", "Clean Architecture"),
    ],
  );
};

// Back-to-front, like the avatar.
const BUBBLE_PIVOT = [131, 80];
const puff = (i, cx, cy, r) =>
  group(`Puff${i}`, [cx, cy], [ellipse(cx, cy, r, r, bubbleLine)], {
    opacity: 0,
  });
const thoughtScene = group(
  "ThoughtScene",
  [0, 0],
  [
    puff(1, 122, 113, 2.2),
    puff(2, 126, 102.5, 3.2),
    puff(3, 131, 90.5, 4.4),
    group(
      "Bubble",
      BUBBLE_PIVOT,
      [
        group("BubbleBob", BUBBLE_PIVOT, [
          line(cloudD(14, 12, 212, 64, 26, 16), bubbleLine),
          group("IdeaText", TEXT_AT, [{ kind: "raw", xml: textXml("center") }]),
          group("CodeText", TEXT_AT, [{ kind: "raw", xml: textXml("left") }], {
            opacity: 0,
          }),
        ]),
      ],
      { opacity: 0 },
    ),
  ],
);
computeRest(thoughtScene, [0, 0]);

const PUFFS = ["Puff1", "Puff2", "Puff3"];
const thoughtClosed = pose("Thought closed", {
  "Bubble.opacity": 0,
  "Bubble.scale": 0.7,
  "BubbleBob.y": 0,
  ...Object.fromEntries(PUFFS.flatMap((p) => [[`${p}.opacity`, 0]])),
  ...Object.fromEntries(PUFFS.map((p) => [`${p}.scale`, 0.3])),
});
const thoughtOpen = anim(
  "Thought open",
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
const thoughtFloat = anim(
  "Thought float",
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
const thoughtClose = anim(
  "Thought close",
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

const thoughtLayer = layer("Bubble", () => {
  const closed = id();
  const opening = id();
  const floating = id();
  const closing = id();
  const isOpen = (v) => [cond.bool("open", v, TVM)];
  return {
    first: closed,
    xml: [
      st(thoughtClosed, 160, 100, [to(opening, {}, isOpen(true))], {
        id: closed,
      }).xml,
      st(
        thoughtOpen,
        360,
        100,
        [done(floating), to(closing, { duration: 80 }, isOpen(false))],
        { id: opening },
      ).xml,
      st(
        thoughtFloat,
        560,
        100,
        [to(closing, { duration: 80 }, isOpen(false))],
        { id: floating },
      ).xml,
      st(
        thoughtClose,
        360,
        260,
        [done(closed), to(opening, { duration: 80 }, isOpen(true))],
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

const TSM = id();
const thoughtStateMachine = el("StateMachine", { name: "Thought", id: TSM }, [
  thoughtLayer,
  toggleLayer("Kind", "isCode", ideaShown, codeShown, [0, 0], TVM),
]);
const thoughtAnims = ANIMS.splice(0);
const THOUGHT_STYLE = id();

const thoughtArtboard = el(
  "Artboard",
  {
    defaultStateMachineId: TSM,
    viewModelId: TVM.id,
    viewModelInstanceId: TVM.inst,
    x: 200,
    y: 0,
    width: THOUGHT.w,
    height: THOUGHT.h,
    name: "Thought",
    styleId: THOUGHT_STYLE,
    id: id(),
  },
  [
    el("LayoutComponentStyle", { name: "Artboard Style", id: THOUGHT_STYLE }),
    nodeXml(thoughtScene, [0, 0]),
    thoughtStateMachine,
    ...thoughtAnims,
  ],
);

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
  thoughtArtboard,
  ...viewModelXml(),
  thoughtViewModelXml(),
  el("FontAsset", {
    file: "fonts/NotoSans-Regular.ttf",
    name: "Noto Sans",
    id: FONT,
  }),
]);

// ---------------------------------------------------------------------------
// Write, build, copy
// ---------------------------------------------------------------------------

mkdirSync(PROJECT, { recursive: true });
writeFileSync(join(PROJECT, "rive.yaml"), "name: avatar\n");
writeFileSync(
  join(PROJECT, "scene.rml"),
  `<!-- Generated by scripts/avatar-rive.mjs. Do not edit by hand. -->\n${doc.replace(/></g, ">\n<")}\n`,
);
console.log("wrote rive/avatar/scene.rml");

if (!process.argv.includes("--no-build")) {
  execSync(`rive "${PROJECT}" --once`, { stdio: "inherit" });
  copyFileSync(
    join(PROJECT, "build", "avatar.riv"),
    join(ROOT, "public", "avatar.riv"),
  );
  console.log("copied public/avatar.riv");
}
