import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** "+" mark sitting on the grid's border intersections. */
function Cross({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 hidden text-faint min-[1100px]:block",
        className,
      )}
    >
      <path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

type SectionProps = {
  id?: string;
  label?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  label,
  title,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-16 border-t border-line", className)}
    >
      <Cross className="-top-[7px] -left-[7px]" />
      <Cross className="-top-[7px] -right-[7px]" />
      {(label || title) && (
        <header className="px-6 pt-14 pb-10 md:px-10">
          {label && (
            <p className="font-mono text-xs text-muted uppercase tracking-wider">
              {label}
            </p>
          )}
          {title && (
            <h2 className="mt-3 max-w-2xl text-balance font-semibold text-3xl tracking-[-0.035em] md:text-4xl">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
