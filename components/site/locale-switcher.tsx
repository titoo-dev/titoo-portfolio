"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  type Locale,
  locales,
  switchLocalePath,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  lang: Locale;
  label: string;
  names: Record<Locale, string>;
};

/** FR / EN pill linking to the current page in each language. */
export function LocaleSwitcher({ lang, label, names }: Props) {
  const pathname = usePathname();

  function remember(locale: Locale) {
    // biome-ignore lint/suspicious/noDocumentCookie: a plain cookie is all the proxy needs to read the choice back
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <fieldset className="flex items-center gap-0.5 rounded-full border border-line bg-bg/60 p-0.5 font-mono text-[11px] uppercase">
      <legend className="sr-only">{label}</legend>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocalePath(pathname, locale)}
          hrefLang={locale}
          lang={locale}
          aria-label={names[locale]}
          aria-current={locale === lang ? "true" : undefined}
          onClick={() => remember(locale)}
          className={cn(
            "grid h-6 min-w-7 place-items-center rounded-full px-1.5 text-muted transition-colors hover:text-fg",
            locale === lang &&
              "bg-subtle text-fg shadow-[0_0_0_1px_var(--line)]",
          )}
        >
          {locale}
        </Link>
      ))}
    </fieldset>
  );
}
