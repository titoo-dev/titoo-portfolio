import type { MetadataRoute } from "next";
import { locales, localizePath, siteUrl } from "@/lib/i18n";
import { projectSlugs } from "@/lib/portfolio-data";

/** One entry per page and locale, each listing its translations. */
function entries(
  path: string,
  options: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}${localizePath(path, l)}`]),
  );
  return locales.map((l) => ({
    url: languages[l],
    lastModified: new Date(),
    alternates: { languages },
    ...options,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entries("", { changeFrequency: "monthly", priority: 1 }),
    ...projectSlugs.flatMap((slug) =>
      entries(`projects/${slug}`, { changeFrequency: "yearly", priority: 0.7 }),
    ),
  ];
}
