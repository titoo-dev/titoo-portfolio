import { OwlFigure } from "./sky-art";

/**
 * Hills, trees and a cabin closing the page under the sky. A server
 * component: its colors come from the scene attributes the client <Sky> sets
 * on <html> (`data-sky-phase`, `data-sky-season`...), so the trees bloom,
 * turn orange or go bare with the season, and the owl only comes out at night.
 */

const FAR =
  "M0 168C120 140 240 128 380 146S640 118 800 128S1080 150 1220 132S1380 120 1440 128V280H0Z";
const MID =
  "M0 200C140 178 280 170 420 186S700 160 880 174S1180 196 1300 182S1410 172 1440 176V280H0Z";
const NEAR =
  "M0 236C200 218 420 222 640 230S1060 214 1240 222S1400 228 1440 226V280H0Z";

// [x, base y, height]
const FAR_PINES = [
  [300, 144, 22],
  [326, 145, 16],
  [760, 130, 24],
  [786, 131, 17],
  [1150, 140, 20],
];
const MID_PINES = [
  [90, 196, 46],
  [130, 194, 34],
  [470, 186, 40],
  [505, 187, 30],
  [1010, 182, 46],
  [1050, 184, 32],
  [1360, 181, 42],
  [1392, 180, 30],
];

function pine(x: number, y: number, h: number) {
  const p = (dx: number, dy: number) => `${x + dx * h} ${y - dy * h}`;
  return `M${p(0, 1)}L${p(0.26, 0.55)}L${p(0.15, 0.55)}L${p(0.34, 0.18)}L${p(0.2, 0.18)}L${p(0.4, 0)}L${p(-0.4, 0)}L${p(-0.2, 0.18)}L${p(-0.34, 0.18)}L${p(-0.15, 0.55)}L${p(-0.26, 0.55)}Z`;
}

function Pines({ list, className }: { list: number[][]; className: string }) {
  return (
    <g>
      {list.map(([x, y, h]) => (
        <g key={x}>
          <path d={pine(x, y, h)} className={className} />
          <path
            d={`M${x} ${y - h}L${x + 0.18 * h} ${y - 0.66 * h}L${x - 0.18 * h} ${y - 0.66 * h}Z`}
            className="land-snow"
          />
        </g>
      ))}
    </g>
  );
}

const CANOPY = [
  [-30, -92, 25],
  [0, -112, 31],
  [30, -94, 25],
  [-16, -74, 21],
  [17, -73, 21],
  [0, -88, 27],
];
const CANOPY_LIGHT = [
  [-34, -99, 12],
  [-7, -121, 16],
  [21, -104, 12],
];
// Blossom spots inside the canopy, for spring.
const BLOSSOMS = [
  [-38, -96],
  [-26, -108],
  [-12, -126],
  [6, -130],
  [20, -118],
  [36, -100],
  [-30, -80],
  [-8, -96],
  [10, -100],
  [28, -82],
  [-18, -64],
  [14, -62],
  [-44, -86],
  [44, -88],
  [0, -72],
  [-2, -112],
  [24, -96],
  [-22, -92],
];

function Tree({
  x,
  y,
  scale,
  owl,
  hoot,
}: {
  x: number;
  y: number;
  scale: number;
  owl?: boolean;
  hoot?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-6 0L-4-58C-4-68-10-76-16-82L-12-85C-6-79-1-73 0-69C1-75 6-83 12-89L16-87C10-79 4-71 4-60L7 0Z"
        className="land-trunk"
      />
      {owl && (
        <path
          d="M-3-46C-20-48-44-52-70-60"
          strokeWidth="5"
          strokeLinecap="round"
          className="land-branch"
        />
      )}
      <g className="land-canopy">
        {CANOPY.map(([cx, cy, r]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g className="land-canopy-light">
        {CANOPY_LIGHT.map(([cx, cy, r]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g className="land-blossoms">
        {BLOSSOMS.map(([cx, cy]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3.2" />
        ))}
      </g>
      <g className="land-snow">
        <ellipse cx="-24" cy="-108" rx="16" ry="5" />
        <ellipse cx="4" cy="-136" rx="18" ry="5" />
        <ellipse cx="30" cy="-112" rx="14" ry="4.5" />
      </g>
      {owl && (
        <g className="land-owl">
          <g transform="translate(-46 -84) scale(0.55)">
            <OwlFigure />
          </g>
          <text x="-96" y="-118" className="land-hoot font-mono">
            {hoot}
          </text>
        </g>
      )}
    </g>
  );
}

function Cabin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="land-smoke">
        <circle cx="14" cy="-46" r="4" />
        <circle cx="14" cy="-46" r="5" />
        <circle cx="14" cy="-46" r="6" />
      </g>
      <rect x="10" y="-44" width="7" height="14" className="land-roof" />
      <rect x="-24" y="-28" width="48" height="28" className="land-wall" />
      <path d="M-30-26L0-48L30-26Z" className="land-roof" />
      <rect
        x="-15"
        y="-19"
        width="11"
        height="10"
        rx="1"
        className="land-window"
      />
      <rect x="5" y="-17" width="10" height="17" className="land-door" />
    </g>
  );
}

// Grass tufts along the front hill, placed by a fixed pattern.
const TUFTS = Array.from({ length: 36 }, (_, i) => {
  const x = 20 + i * 40 + ((i * 37) % 23);
  return { x, y: 236 - Math.sin(x / 230) * 6 - ((i * 13) % 5) };
});

export function Landscape({ hoot }: { hoot: string }) {
  return (
    <div aria-hidden="true" className="landscape">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 280"
        preserveAspectRatio="xMidYMax slice"
        className="block size-full"
      >
        <path d={FAR} className="land-far" />
        <Pines list={FAR_PINES} className="land-far-tree" />
        <path d={MID} className="land-mid" />
        <Pines list={MID_PINES} className="land-pine" />
        <path d={NEAR} className="land-near" />
        <Tree x={570} y={228} scale={0.95} />
        <Cabin x={730} y={229} />
        <Tree x={905} y={227} scale={1.3} owl hoot={hoot} />
        <Tree x={250} y={226} scale={0.8} />
        <Tree x={1230} y={224} scale={1.05} />
        <g className="land-grass">
          {TUFTS.map(({ x, y }) => (
            <path
              key={x}
              d={`M${x} ${y}q1-7 -3-12M${x + 3} ${y}q0-8 3-13M${x + 6} ${y}q1-5 4-8`}
              style={{ animationDelay: `${-(x % 7) * 0.4}s` }}
            />
          ))}
        </g>
        <g className="land-flowers">
          {TUFTS.filter((_, i) => i % 3 === 0).map(({ x, y }, i) => (
            <circle
              key={x}
              cx={x + 12}
              cy={y - 2}
              r="2.6"
              className={i % 2 ? "land-flower-a" : "land-flower-b"}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
