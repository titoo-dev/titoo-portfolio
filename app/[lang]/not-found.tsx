"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";

// not-found.tsx gets no props, so the locale comes from the URL.
export default function NotFound() {
  const { lang } = useParams<{ lang: string }>();
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = getDictionary(locale).notFound;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1080px] flex-col items-center justify-center border-line border-x px-6 text-center">
      <p className="font-mono text-muted text-xs">404</p>
      <h1 className="mt-3 font-semibold text-3xl tracking-[-0.04em]">
        {t.title}
      </h1>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex h-10 items-center rounded-full bg-fg px-4 font-medium text-bg text-sm transition-opacity hover:opacity-85"
      >
        {t.back}
      </Link>
    </main>
  );
}
