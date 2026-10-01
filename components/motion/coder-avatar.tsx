/**
 * Line-art self-portrait (curly hair, round glasses, short beard, open-collar
 * shirt) coding behind a laptop: strokes only, in the theme's foreground
 * tones. A chip above the shoulder flips from "?" to "✓" on the hero's shared
 * 4s cycle: problems in, solutions out. Motion lives in globals.css
 * (`.avatar-*`), so this stays a server component.
 */

// Hair outline, left temple → crown → right temple; scalloped for the curls.
const HAIR = [
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
] as const;

const hairPath = HAIR.map(([x, y], i) => {
  if (i === 0) return `M${x} ${y}`;
  const [px, py] = HAIR[i - 1];
  const r = Math.hypot(x - px, y - py) / 1.7;
  return `A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${x} ${y}`;
}).join("");

export function CoderAvatar({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) {
  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="avatar-clip">
          <rect width="120" height="120" rx="24.7" />
        </clipPath>
      </defs>

      <g
        clipPath="url(#avatar-clip)"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-fg"
      >
        {/* Hair: scalloped outline, hairline, a few inner curls */}
        <path d={hairPath} />
        <path d="M44.5 47C47.5 40.5 53 38.5 60 38.5C67 38.5 72.5 40.5 75.5 47" />
        <path
          d="M50 31.5a2.6 2.6 0 0 1 4.4 1M58 27.5a2.6 2.6 0 0 1 4.6.4M66 30a2.6 2.6 0 0 1 4.2 1.8M47 38a2.4 2.4 0 0 1 3.6-1.4M71 36.6a2.4 2.4 0 0 1 3.4 1.6"
          className="stroke-muted"
          strokeWidth="1.1"
        />

        {/* Face + ears */}
        <path d="M44.5 47C44.5 62 50 73.5 60 75.5C70 73.5 75.5 62 75.5 47" />
        <path d="M44.2 51C41 50 39.6 52 39.9 55.2C40.2 58.4 42 60 44.6 59.4" />
        <path d="M75.8 51C79 50 80.4 52 80.1 55.2C79.8 58.4 78 60 75.4 59.4" />

        {/* Brows, eyes (blink), nose */}
        <path d="M48 45.4Q52.5 43.4 57 45M63 45Q67.5 43.4 72 45.4" />
        <g className="avatar-eyes">
          <circle cx="52.5" cy="52.4" r="0.9" strokeWidth="1.6" />
          <circle cx="67.5" cy="52.4" r="0.9" strokeWidth="1.6" />
        </g>
        <path
          d="M60 54.5Q58.8 59.5 57.4 60.8Q60 62.2 62.6 60.8"
          className="stroke-muted"
        />

        {/* Round metal glasses; the glint catches the screen on "solved" */}
        <circle cx="52.5" cy="52" r="6.2" />
        <circle cx="67.5" cy="52" r="6.2" />
        <path d="M58.7 51.2Q60 49.8 61.3 51.2M46.3 51L44 50.3M73.7 51L76 50.3" />
        <path
          d="M48.9 49.8l2.3-2.3M63.9 49.8l2.3-2.3"
          className="avatar-glint stroke-muted"
          strokeWidth="1.1"
        />

        {/* Moustache, smile, goatee, dotted stubble along the jaw */}
        <path d="M54.4 64.8C56.5 63 63.5 63 65.6 64.8" />
        <path d="M56.6 67.4Q60 69.8 63.4 67.2" />
        <path d="M56 71.2C57.5 74.6 62.5 74.6 64 71.2" />
        <path
          d="M46.5 60C48 67.5 53 72 60 72.8C67 72 72 67.5 73.5 60"
          className="stroke-muted"
          strokeWidth="1.2"
          strokeDasharray="0.01 2.4"
        />

        {/* Neck, open collar, placket, shoulders */}
        <path d="M54 74V80.5M66 74V80.5" />
        <path d="M54 80L60 89L66 80" />
        <path d="M54 80L47.5 85.5L52.5 92.5L60 89L67.5 92.5L72.5 85.5L66 80" />
        <path d="M60 89V96" />
        <path d="M47.5 85.5C38 87 30 90 25 95.5C20 102 17 110 16 122" />
        <path d="M72.5 85.5C82 87 90 90 95 95.5C100 102 103 110 104 122" />

        {/* Laptop lid, seen from the back */}
        <rect x="32" y="96" width="56" height="30" rx="3" />
        <path
          d="M55.5 105.5l-3 3 3 3M64.5 105.5l3 3-3 3M61.4 104.5l-2.8 8"
          className="stroke-muted"
          strokeWidth="1.2"
        />

        {/* Thought bubble: code being typed */}
        <g className="float-y" strokeWidth="1.1">
          <rect
            x="8"
            y="12"
            width="27"
            height="16"
            rx="5"
            className="stroke-line-strong"
          />
          <path d="M12.5 17.8h9" strokeWidth="1.4" />
          <path
            d="M12.5 22.6h12"
            pathLength={1}
            className="avatar-type stroke-muted"
            strokeWidth="1.4"
          />
          <path d="M28.6 20.4v4.6" className="blink" strokeWidth="1.2" />
        </g>

        {/* Problem -> solution chip */}
        <g transform="translate(100 21)">
          <circle r="8.5" className="stroke-line-strong" strokeWidth="1.1" />
          <path
            d="M-2.4-2.2a2.4 2.4 0 1 1 3.4 2.1c-.8.4-1 .9-1 1.7M0 3.7v.1"
            className="avatar-problem stroke-muted"
            strokeWidth="1.5"
          />
          <path
            d="M-3.6.2l2.4 2.4L3.8-2.6"
            className="avatar-solution"
            strokeWidth="1.6"
          />
        </g>
      </g>
    </svg>
  );
}
