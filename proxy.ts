import { type NextRequest, NextResponse } from "next/server";
import {
  internalPath,
  isLocale,
  LOCALE_COOKIE,
  localizePath,
  matchLocale,
  switchLocalePath,
} from "@/lib/i18n";

/**
 * Every page lives under `/fr` or `/en`.
 * - No prefix (`/`, legacy `/projets/x`): redirect to the visitor's language,
 *   i.e. the one they picked (cookie), else their browser/OS language.
 * - Prefixed: redirect a segment spelled for another locale to this one's
 *   (`/fr/projects/x` -> `/fr/projets/x`), then rewrite the localized segment
 *   to the route folder (`/fr/projets/x` -> `/fr/projects/x`).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lang = pathname.split("/")[1];

  if (!isLocale(lang)) {
    const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(cookie)
      ? cookie
      : matchLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = localizePath(pathname, locale);
    const response = NextResponse.redirect(url);
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
  }

  const canonical = switchLocalePath(pathname, lang);
  if (canonical !== pathname.replace(/\/+$/, "")) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.redirect(url, 308);
  }

  const internal = internalPath(pathname);
  if (internal !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = internal;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and anything that looks like a file (sitemap.xml,
  // images, the CV...).
  matcher: ["/((?!_next/|_vercel/|api/|.*\\..*).*)"],
};
