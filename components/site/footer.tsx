import { PROFILE } from "@/lib/portfolio-data";
import { LocalTime } from "./local-time";
import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6 px-6 py-8 text-muted text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo size={20} />
          <span>© {new Date().getFullYear()} Titosy Manankasina</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs">
          <span className="flex items-center gap-2">
            <StatusDot />
            Disponible
          </span>
          <span>
            Antananarivo · <LocalTime />
          </span>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-fg"
          >
            LinkedIn
          </a>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-fg"
          >
            GitHub
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}

/** Green dot with an expanding ring — "online" indicator. */
export function StatusDot() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      overflow="visible"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="2.5" className="pulse-ring fill-success" />
      <circle cx="5" cy="5" r="3" className="fill-success" />
    </svg>
  );
}
