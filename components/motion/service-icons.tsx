/**
 * Line icons for the services grid. Strokes marked `.draw` trace themselves
 * when an ancestor gets `data-inview="true"`; one detail per icon loops.
 */

const common = {
  width: 44,
  height: 44,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Browser window: code lines type in, cursor blinks. */
function WebIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <rect
        x="4"
        y="8"
        width="40"
        height="32"
        rx="4"
        pathLength={1}
        className="draw"
      />
      <path d="M4 16h40" pathLength={1} className="draw draw-d1" />
      <g className="fill-current" stroke="none">
        <circle cx="9" cy="12" r="1.2" />
        <circle cx="13" cy="12" r="1.2" />
        <circle cx="17" cy="12" r="1.2" />
      </g>
      <path d="m12 23-3 3 3 3" pathLength={1} className="draw draw-d2" />
      <path d="M17 23h14M17 29h9" pathLength={1} className="draw draw-d3" />
      <path d="M28.5 26.5v5" className="blink stroke-accent" />
    </svg>
  );
}

/** Phone: screen cards float. */
function MobileIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <rect
        x="13"
        y="4"
        width="22"
        height="40"
        rx="5"
        pathLength={1}
        className="draw"
      />
      <path d="M21 8.5h6" pathLength={1} className="draw draw-d1" />
      <g className="float-y">
        <rect
          x="17"
          y="14"
          width="14"
          height="8"
          rx="2"
          pathLength={1}
          className="draw draw-d2"
        />
      </g>
      <g className="float-y" style={{ animationDelay: "0.4s" }}>
        <path d="M17 27h14M17 32h9" pathLength={1} className="draw draw-d3" />
      </g>
      <circle cx="24" cy="39" r="1.3" className="fill-current" stroke="none" />
    </svg>
  );
}

/** Pen tool: a bezier with twinkling anchors. */
function DesignIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <path d="M6 36C14 10 34 10 42 36" pathLength={1} className="draw" />
      <path
        d="M6 36 17 14M42 36 31 14"
        strokeDasharray="2 3"
        className="stroke-faint"
      />
      <g className="stroke-accent" fill="var(--bg)">
        <rect
          x="3.5"
          y="33.5"
          width="5"
          height="5"
          rx="1"
          className="twinkle"
        />
        <rect
          x="39.5"
          y="33.5"
          width="5"
          height="5"
          rx="1"
          className="twinkle"
          style={{ animationDelay: "0.8s" }}
        />
      </g>
      <g className="fill-current" stroke="none">
        <circle
          cx="17"
          cy="14"
          r="2"
          className="twinkle"
          style={{ animationDelay: "0.4s" }}
        />
        <circle
          cx="31"
          cy="14"
          r="2"
          className="twinkle"
          style={{ animationDelay: "1.2s" }}
        />
      </g>
    </svg>
  );
}

/** Two nodes exchanging data along a dotted link. */
function ConsultIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <rect
        x="4"
        y="6"
        width="22"
        height="16"
        rx="4"
        pathLength={1}
        className="draw"
      />
      <rect
        x="22"
        y="26"
        width="22"
        height="16"
        rx="4"
        pathLength={1}
        className="draw draw-d1"
      />
      <path d="M15 22v6a4 4 0 0 0 4 4h3" className="data-flow stroke-accent" />
      <g className="fill-current" stroke="none">
        <circle cx="10" cy="14" r="1.4" className="blink" />
        <circle
          cx="15"
          cy="14"
          r="1.4"
          className="blink"
          style={{ animationDelay: "0.2s" }}
        />
        <circle
          cx="20"
          cy="14"
          r="1.4"
          className="blink"
          style={{ animationDelay: "0.4s" }}
        />
      </g>
      <path d="M28 34h10" pathLength={1} className="draw draw-d2" />
    </svg>
  );
}

export const SERVICE_ICONS = [WebIcon, MobileIcon, DesignIcon, ConsultIcon];
