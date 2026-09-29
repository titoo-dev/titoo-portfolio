// ---------------------------------------------------------------------------
// Locale config and URL helpers, shared by the proxy, server and client code.
// ---------------------------------------------------------------------------

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

/** Used when neither the cookie nor Accept-Language matches a locale. */
export const defaultLocale: Locale = "en";

/** Set when the visitor picks a language by hand; wins over Accept-Language. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const siteUrl = "https://titosy.dev";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Translated path segments. The key is the folder name under `app/[lang]`;
 * the proxy rewrites each public segment to it.
 */
const SEGMENTS: Record<string, Record<Locale, string>> = {
  projects: { fr: "projets", en: "projects" },
};

function translateSegment(segment: string, locale: Locale) {
  for (const [key, byLocale] of Object.entries(SEGMENTS)) {
    if (key === segment || Object.values(byLocale).includes(segment)) {
      return byLocale[locale];
    }
  }
  return segment;
}

function internalSegment(segment: string) {
  for (const [key, byLocale] of Object.entries(SEGMENTS)) {
    if (Object.values(byLocale).includes(segment)) return key;
  }
  return segment;
}

/** `/projets/x` or `/projects/x` (no locale prefix) -> `/{locale}/{localized}/x`. */
export function localizePath(path: string, locale: Locale) {
  const [first, ...rest] = path.replace(/^\/+/, "").split("/");
  const localized = [first && translateSegment(first, locale), ...rest]
    .filter(Boolean)
    .join("/");
  return localized ? `/${locale}/${localized}` : `/${locale}`;
}

/** Same page in another locale: `/fr/projets/x` -> `/en/projects/x`. */
export function switchLocalePath(pathname: string, locale: Locale) {
  const [first, ...rest] = pathname.replace(/^\/+/, "").split("/");
  return localizePath(isLocale(first) ? rest.join("/") : pathname, locale);
}

/** Public `/fr/projets/x` -> the route that renders it, `/fr/projects/x`. */
export function internalPath(pathname: string) {
  const [, lang, first, ...rest] = pathname.split("/");
  if (!first) return pathname;
  return ["", lang, internalSegment(first), ...rest].join("/");
}

export const projectPath = (locale: Locale, slug: string) =>
  localizePath(`projects/${slug}`, locale);

/** hreflang map for a locale-agnostic path such as `projects/tononkira`. */
export function languageAlternates(path = "") {
  return {
    ...Object.fromEntries(locales.map((l) => [l, localizePath(path, l)])),
    "x-default": `/${path}`,
  };
}

/** Best locale for an Accept-Language header, honoring q-values. */
export function matchLocale(header: string | null): Locale {
  const ranked = (header ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((l) => l.tag && l.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}
