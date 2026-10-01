/**
 * Building blocks for the Rive files generated from code (scripts/*-rive.mjs):
 * ids and XML, SVG paths -> Rive vertices, the scene tree (groups, shapes,
 * paints bound to view-model colours), keyframed animations, state-machine
 * layers and conditions, and writing + building a CLI project.
 *
 * State (ids, the name registry, collected animations) is module-level: each
 * generator runs in its own process and builds one file.
 */

import { execSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// ---------------------------------------------------------------------------
// Ids, numbers, xml
// ---------------------------------------------------------------------------

let nextId = 10;
export const id = () => `0:${nextId++}`;
export const n = (v) => {
  const r = Math.round(v * 10000) / 10000;
  return Object.is(r, -0) ? "0" : String(r);
};
export const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${typeof v === "number" ? n(v) : v}"`)
    .join(" ");
export const el = (tag, a = {}, children = []) => {
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

export function parsePath(d) {
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
export function pointsPaths(d, origin) {
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
// View models
// ---------------------------------------------------------------------------

let defaultVM = null;
/** The view model colour paints and conditions bind to unless told otherwise. */
export const setViewModel = (vm) => {
  defaultVM = vm;
};
const path = (prop, vm = defaultVM) => `${vm.id}-${vm.props[prop]}`;
export { path };

const cap = (s) => s[0].toUpperCase() + s.slice(1);
/**
 * A view model without enums: props are [name, type, default] with type
 * boolean | number | string | color | trigger.
 */
export function simpleViewModel(name, props) {
  const vm = { id: id(), inst: id(), props: {} };
  for (const [prop] of props) vm.props[prop] = id();
  const xml = () =>
    el("ViewModel", { defaultInstanceId: vm.inst, name, id: vm.id }, [
      ...props.map(([prop, type]) =>
        el(`ViewModelProperty${cap(type)}`, { name: prop, id: vm.props[prop] }),
      ),
      el(
        "ViewModelInstance",
        { exports: "true", name: "Default", id: vm.inst },
        props.map(([prop, type, value]) =>
          type === "trigger"
            ? el("ViewModelInstanceTrigger", {
                viewModelPropertyId: vm.props[prop],
              })
            : el(`ViewModelInstance${cap(type)}`, {
                propertyValue:
                  typeof value === "boolean" ? String(value) : value,
                viewModelPropertyId: vm.props[prop],
              }),
        ),
      ),
    ]);
  return { vm, xml };
}

// ---------------------------------------------------------------------------
// Scene tree. Children are listed back-to-front (like SVG) and reversed on
// output, since Rive draws the first sibling on top.
// ---------------------------------------------------------------------------

export const REG = {}; // name -> node (for keying)

export function group(name, pivot, children, opts = {}) {
  const node = { kind: "node", name, pivot, children, id: id(), ...opts };
  REG[name] = node;
  return node;
}

export const INK = {
  ink: "FF171717",
  inkSoft: "FF666666",
  inkFaint: "FFD6D6D6",
  paper: "FFFFFFFF",
};

export function paint(kind, color, extra = {}, children = [], vm = defaultVM) {
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

export const stroke = (color = "ink", w = 1.4, children = [], vm = defaultVM) =>
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
export function line(d, opts = {}) {
  return named({ kind: "path", d, color: "ink", w: 1.4, id: id(), ...opts });
}
export function ellipse(cx, cy, rx, ry, opts = {}) {
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
export function rect(x, y, w, h, r, opts = {}) {
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
export function computeRest(node, parentPivot) {
  const at = node.at ?? node.pivot;
  node.rest = {
    x: at[0] - parentPivot[0],
    y: at[1] - parentPivot[1],
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

export function shapeXml(s, parentPivot) {
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

export function nodeXml(node, parentPivot) {
  const at = node.at ?? node.pivot;
  const rest = {
    x: at[0] - parentPivot[0],
    y: at[1] - parentPivot[1],
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
      rotation: node.rotation,
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
// Animations
// ---------------------------------------------------------------------------

export const KEY = {
  x: 13,
  y: 14,
  rotation: 15,
  scaleX: 16,
  scaleY: 17,
  opacity: 18,
  end: 115,
};
export const EASE = el("CubicEaseInterpolator", {
  x1: 0.42,
  y1: 0,
  x2: 0.58,
  y2: 1,
});

export const ANIMS = [];

/**
 * tracks: { "Target.prop": [[frame, value, interp?], ...] }
 * x/y values are offsets from the target's rest position.
 * interp: "ease" (default) | "linear" | "hold"
 */
export function anim(
  name,
  { duration = 1, loop = "oneShot" } = {},
  tracks = {},
) {
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
export const pose = (name, values, extra = {}) =>
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

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

export const bindable = (type, prop, extra = {}) => {
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

export const cond = {
  bool: (prop, value, vm) =>
    el("TransitionViewModelCondition", {}, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Boolean", prop, { vm }),
      ]),
      el("TransitionValueBooleanComparator", { value: String(value) }),
    ]),
  trigger: (prop, vm) =>
    el("TransitionViewModelCondition", {}, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Trigger", prop, { vm }),
      ]),
      el("TransitionValueTriggerComparator"),
    ]),
  enum: (prop, valueId, vm) =>
    el("TransitionViewModelCondition", {}, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Enum", prop, { vm }),
      ]),
      el("TransitionValueEnumComparator", { value: valueId }),
    ]),
  number: (prop, op, value, vm) =>
    el("TransitionViewModelCondition", { opValue: op }, [
      el("TransitionPropertyViewModelComparator", {}, [
        bindable("Number", prop, { vm }),
      ]),
      el("TransitionValueNumberComparator", { value }),
    ]),
};

export const to = (stateId, extra = {}, conditions = []) =>
  el("StateTransition", { stateToId: stateId, ...extra }, conditions);
export const done = (stateId) =>
  to(stateId, {
    enableExitTime: "true",
    exitTimeIsPercetange: "true",
    exitTime: 100,
    duration: 160,
  });

export function layer(name, build) {
  const states = build();
  return el("StateMachineLayer", { name, id: id() }, [
    el("AnyState", { x: 640, y: -120 }, states.any ?? []),
    el("ExitState", { x: 840, y: -120 }),
    el("EntryState", { x: 0, y: 100 }, [to(states.first)]),
    ...states.xml,
  ]);
}

export const st = (animationId, x, y, transitions = [], extra = {}) => {
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
export function toggleLayer(name, prop, offAnim, onAnim, ms = [200, 200], vm) {
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

export const loopLayer = (name, animId) =>
  layer(name, () => {
    const s = st(animId, 160, 100);
    return { first: s.id, xml: [s.xml] };
  });

export const listener = (target, type, actions, name) =>
  el(
    "StateMachineListenerSingle",
    { targetId: REG[target].id, listenerTypeValue: type, name },
    actions,
  );
export const writeBool = (prop, value) =>
  el("ListenerViewModelChange", {}, [
    bindable("Boolean", prop, { value: String(value), write: true }),
  ]);
export const fire = (prop) =>
  el("ListenerViewModelChange", {}, [
    bindable("Trigger", prop, { value: 1, write: true }),
  ]);

// ---------------------------------------------------------------------------
// Write, build, copy
// ---------------------------------------------------------------------------

/** Writes rive/<name>/scene.rml, then (unless --no-build) builds public/<name>.riv. */
export function writeProject(name, doc, generator) {
  const project = join(ROOT, "rive", name);
  mkdirSync(project, { recursive: true });
  writeFileSync(join(project, "rive.yaml"), `name: ${name}\n`);
  writeFileSync(
    join(project, "scene.rml"),
    `<!-- Generated by ${generator}. Do not edit by hand. -->\n${doc.replace(/></g, ">\n<")}\n`,
  );
  console.log(`wrote rive/${name}/scene.rml`);
  if (process.argv.includes("--no-build")) return;
  execSync(`rive "${project}" --once`, { stdio: "inherit" });
  copyFileSync(
    join(project, "build", `${name}.riv`),
    join(ROOT, "public", `${name}.riv`),
  );
  console.log(`copied public/${name}.riv`);
}
