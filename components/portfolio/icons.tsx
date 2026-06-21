// biome-ignore-all lint/a11y/noSvgWithoutTitle: decorative icons; labels live on the parent control or adjacent text
// Inline SVG icons used across the portfolio, ported from the design prototype.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { display: "block" } as const,
  };
}

export function MailIcon({ size = 13, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7.5 8.5 5.5 8.5-5.5" />
    </svg>
  );
}

export function LinkedInIcon({
  size = 15,
  ...rest
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="#0A66C2"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ display: "block", flex: "none" }}
      {...rest}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function ExpandIcon({ size = 13, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4} {...rest}>
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

export function ArrowDownIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} {...rest}>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

export function CloseIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} strokeLinejoin="miter" {...rest}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 17, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 17, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function ExternalCircleIcon({ size = 22, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12h6M13 9l3 3-3 3" />
    </svg>
  );
}

export function CalendarIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} {...rest}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function PinIcon({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} {...rest}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function CheckIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg
      {...base(size)}
      stroke="var(--accent,#f2611a)"
      strokeWidth={2.4}
      style={{ display: "block", flex: "none", marginTop: 1 }}
      {...rest}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
