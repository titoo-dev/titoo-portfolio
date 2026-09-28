/** Monogram: a solid tile with a geometric "T" knocked out of it. */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="24" height="24" rx="6" className="fill-fg" />
      <path d="M6.5 7h11v2.6h-4.2V18h-2.6V9.6H6.5Z" className="fill-bg" />
    </svg>
  );
}
