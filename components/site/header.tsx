import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getContent } from "@/lib/portfolio-data";
import { GithubIcon } from "./icons";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

export function Header({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const nav = [
    { id: t.ids.projects, label: t.nav.projects },
    { id: t.ids.experience, label: t.nav.experience },
    { id: t.ids.stack, label: t.nav.stack },
  ];

  return (
    <header className="sticky top-0 z-50 border-line border-b bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between gap-3 px-6">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5 font-medium text-sm tracking-tight"
        >
          <Logo />
          {/* Logo only on narrow phones: the language switcher needs the room. */}
          <span className="sr-only whitespace-nowrap min-[440px]:not-sr-only">
            Titosy Manankasina
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.id}
              href={`/${lang}#${item.id}`}
              className="hidden rounded-md px-3 py-1.5 text-muted transition-colors hover:bg-subtle hover:text-fg md:block"
            >
              {item.label}
            </Link>
          ))}
          <LocaleSwitcher
            lang={lang}
            label={t.locale.label}
            names={t.locale.names}
          />
          <a
            href={getContent(lang).PROFILE.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-md p-2 text-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <GithubIcon />
          </a>
          <Link
            href={`/${lang}#${t.ids.contact}`}
            className="ml-1 inline-flex h-8 items-center rounded-full bg-fg px-3.5 font-medium text-bg text-sm transition-opacity hover:opacity-85"
          >
            {t.nav.contact}
          </Link>
        </nav>
      </div>
    </header>
  );
}
