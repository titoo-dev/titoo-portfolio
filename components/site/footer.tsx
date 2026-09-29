import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/portfolio-data";
import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const { PROFILE } = getContent(lang);

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
            {t.status.available}
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
          <ThemeSwitcher labels={t.theme} />
        </div>
      </div>
    </footer>
  );
}

/** Green dot with an expanding ring, used as an "online" indicator. */
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
