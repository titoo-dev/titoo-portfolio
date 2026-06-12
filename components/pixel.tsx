// Pixel-styled SVG primitives. Everything snaps to a unit grid and uses
// crispEdges so the shapes read as bitmap, not vector.

export function PixelArrow({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d="M3 1h6v6H7V5H5v2H3v2H1V7h2V5h2V3H3z" />
    </svg>
  );
}

export function PixelHeart({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 7 7"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d="M1 1h2v1h1V1h2v1h1v2H6v1H5v1H4v1H3V6H2V5H1V4H0V2h1z" />
    </svg>
  );
}

export function PixelAsterisk({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 9 9"
      fill="currentColor"
      shapeRendering="crispEdges"
      className="spin-steps"
      aria-hidden="true"
    >
      <path d="M4 0h1v3H4zM4 6h1v3H4zM0 4h3v1H0zM6 4h3v1H6zM1 1h1v1H1zM7 1h1v1H7zM1 7h1v1H1zM7 7h1v1H7zM2 2h1v1H2zM6 2h1v1H6zM2 6h1v1H2zM6 6h1v1H6z" />
    </svg>
  );
}

/**
 * Square-wave underline that draws itself on load (stroke-dashoffset),
 * then a brighter dash marches along it forever — an oscilloscope signal.
 * Path: 8 horizontal runs of 14 + 7 vertical steps of 5 → length 147.
 */
export function SignatureWave({ className = "" }: { className?: string }) {
  return (
    <svg
      width="254"
      height="20"
      viewBox="0 0 113 9"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        className="draw"
        style={{ "--length": 147, "--duration": "1.4s" } as React.CSSProperties}
        d="M0.5 7.5h14v-5h14v5h14v-5h14v5h14v-5h14v5h14v-5h14"
        stroke="currentColor"
        strokeWidth="1.5"
        shapeRendering="crispEdges"
        opacity="0.45"
      />
      <path
        className="march"
        d="M0.5 7.5h14v-5h14v5h14v-5h14v5h14v-5h14v5h14v-5h14"
        stroke="currentColor"
        strokeWidth="1.5"
        shapeRendering="crispEdges"
      />
    </svg>
  );
}

/**
 * Two-frame pixel bot (space-invader style) animated like a GIF: the
 * frames hard-swap via steps(1), arms and legs alternating.
 */
export function PixelBot({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 6) / 8}
      viewBox="0 0 8 6"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g className="sprite-frame-a">
        <path d="M2 0h1v1H2zM5 0h1v1H5zM1 1h6v1H1zM0 2h2v1H0zM3 2h2v1H3zM6 2h2v1H6zM0 3h8v1H0zM0 4h1v1H0zM2 4h1v1H2zM5 4h1v1H5zM7 4h1v1H7zM2 5h1v1H2zM5 5h1v1H5z" />
      </g>
      <g className="sprite-frame-b">
        <path d="M2 0h1v1H2zM5 0h1v1H5zM1 1h6v1H1zM0 2h2v1H0zM3 2h2v1H3zM6 2h2v1H6zM0 3h8v1H0zM1 4h2v1H1zM5 4h2v1H5zM0 5h1v1H0zM7 5h1v1H7z" />
      </g>
    </svg>
  );
}

/** Column of floating pixel squares, bobbing in hard steps at offset beats. */
export function PixelDrift({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center gap-10 ${className}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="pixel-bob block bg-accent-bright"
          style={{
            width: 6 - i,
            height: 6 - i,
            opacity: 0.7 - i * 0.2,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Blueprint crosshair "+" marker (rauno.me-style drafting guide). */
export function Crosshair({ className = "" }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6.5 0v13M0 6.5h13"
        stroke="var(--hairline-strong)"
        strokeWidth="1"
        shapeRendering="crispEdges"
      />
    </svg>
  );
}
