// Generates the CV PDFs (one per locale, paths from PROFILE.cv) from
// lib/portfolio-data.ts.
//
// The CV is built to be ATS-friendly: one column, real selectable text in
// reading order, standard section headings, no tables, icons or images.
// It is printed with a local Chrome/Edge in headless mode (no dependency).
//
//   pnpm cv                      # uses CHROME_PATH or a default install path
//
// Requires Node 22.18+ (imports the TypeScript data file directly).

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { getContent } from "../lib/portfolio-data.ts";

const LOCALES = ["fr", "en"];

// Contact details only printed on the CV (not shown on the site).
const CONTACT = {
  location: "Antananarivo, Madagascar",
  phone: "+261 38 80 322 74",
  site: "https://titosy.dev",
};

// Projects only listed on the CV (no case study or images on the site).
const CV_PROJECTS = {
  fr: [
    {
      name: "MID",
      url: null,
      year: "2023 - 2024",
      desc: "Interfaces web et mobile d'une application de gestion des ordres d'achat et de vente de devises (freelance) : saisie, validation et suivi des ordres selon le profil utilisateur, notifications push en temps réel, intégration des API d'un backend Laravel.",
      tech: ["Flutter", "Dart", "Firebase Cloud Messaging", "Laravel (API)"],
    },
  ],
  en: [
    {
      name: "MID",
      url: null,
      year: "2023 - 2024",
      desc: "Web and mobile interfaces for a currency buy and sell order management app (freelance): order entry, validation and tracking by user profile, real-time push notifications, integration with a Laravel backend's APIs.",
      tech: ["Flutter", "Dart", "Firebase Cloud Messaging", "Laravel (API)"],
    },
  ],
};

/** Sort key: the last year of "2024" or "2023 - 2024". */
const endYear = (year) => Number(String(year).slice(-4));

const years = new Date().getFullYear() - 2022;

const LABELS = {
  fr: {
    // French puts a space before ":".
    colon: " :",
    languages: "Langages",
    methods: "Méthodes",
    codeReview: "Revue de code",
    profile: "Profil",
    skills: "Compétences techniques",
    experience: "Expérience professionnelle",
    projects: "Projets",
    education: "Formation",
    spokenLanguages: "Langues",
    environment: "Environnement",
    technologies: "Technologies",
    /** "Depuis oct. 2025" -> "Oct. 2025 à aujourd'hui"; other ranges unchanged. */
    period: (p) =>
      p.startsWith("Depuis ")
        ? `${p[7].toUpperCase()}${p.slice(8)} à aujourd'hui`
        : p,
    summary: `Développeur fullstack JavaScript / Flutter avec plus de ${years} ans d'expérience dans la conception et la livraison d'applications web et mobiles (React, Next.js, Node.js, Flutter). J'interviens à toutes les étapes d'un projet, de l'analyse des besoins à la mise en production, avec une pratique DevOps (Kubernetes, Terraform, Argo CD) et des solutions d'IA agentic. J'accompagne les clients dans le cadrage de leurs projets pour proposer des solutions adaptées, simples et efficaces.`,
  },
  en: {
    colon: ":",
    languages: "Programming languages",
    methods: "Methods",
    codeReview: "Code review",
    profile: "Profile",
    skills: "Technical skills",
    experience: "Professional experience",
    projects: "Projects",
    education: "Education",
    spokenLanguages: "Languages",
    environment: "Environment",
    technologies: "Technologies",
    /** "Since Oct. 2025" -> "Oct. 2025 to present"; other ranges unchanged. */
    period: (p) => (p.startsWith("Since ") ? `${p.slice(6)} to present` : p),
    summary: `Fullstack JavaScript / Flutter developer with more than ${years} years of experience designing and shipping web and mobile applications (React, Next.js, Node.js, Flutter). I work at every stage of a project, from requirements analysis to production, with hands-on DevOps practice (Kubernetes, Terraform, Argo CD) and agentic AI solutions. I help clients scope their projects to offer tailored, simple and effective solutions.`,
  },
};

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const bare = (url) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const link = (url) => `<a href="${esc(url)}">${esc(bare(url))}</a>`;

function render(locale) {
  const L = LABELS[locale];
  const { careers, PROFILE, stack, ...content } = getContent(locale);
  // Most recent first, as recruiters read a CV (the site keeps its own order).
  const projects = [...content.projects, ...CV_PROJECTS[locale]].toSorted(
    (a, b) => endYear(b.year) - endYear(a.year),
  );
  const jobs = careers.filter((c) => !c.isEdu);
  const education = careers.filter((c) => c.isEdu);

  // Keywords ATS match against, grouped for a human reader.
  const skills = [
    {
      label: L.languages,
      items: ["JavaScript", "TypeScript", "Dart", "Kotlin", "C++", "SQL"],
    },
    ...stack,
    {
      label: L.methods,
      items: [
        "Scrum",
        "Micro-frontends",
        "Monorepo (Turborepo)",
        "GitOps",
        L.codeReview,
      ],
    },
  ];

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<title>CV ${esc(PROFILE.name)} | ${esc(PROFILE.headline)}</title>
<meta name="author" content="${esc(PROFILE.name)}">
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9.6pt;
    line-height: 1.42;
    color: #1a1a1a;
  }
  a { color: inherit; text-decoration: none; }
  h1 { margin: 0; font-size: 21pt; letter-spacing: -0.2pt; line-height: 1.1; }
  .headline { margin: 3pt 0 0; font-size: 11.5pt; color: #333; }
  .contact { margin: 6pt 0 0; font-size: 9pt; color: #444; }
  .contact span + span::before { content: " | "; color: #999; }
  h2 {
    margin: 13pt 0 6pt;
    padding-bottom: 2.5pt;
    border-bottom: 0.75pt solid #1a1a1a;
    font-size: 10.5pt;
    text-transform: uppercase;
    letter-spacing: 0.6pt;
  }
  p { margin: 0; }
  ul { margin: 3pt 0 0; padding-left: 12pt; }
  li { margin: 1.5pt 0; }
  .skills { list-style: none; padding: 0; margin: 0; }
  .skills li { margin: 2pt 0; }
  .entry { margin-bottom: 9pt; break-inside: avoid; }
  .entry:last-child { margin-bottom: 0; }
  .head { display: flex; justify-content: space-between; gap: 12pt; align-items: baseline; }
  h3 { margin: 0; font-size: 10.2pt; }
  .date { flex-shrink: 0; font-size: 9.2pt; color: #333; }
  .org { margin-top: 1pt; color: #444; }
  .summary { margin-top: 3pt; }
  .tech { margin-top: 3pt; color: #333; }
  .tech b, .skills b { color: #1a1a1a; }
</style>
</head>
<body>
<header>
  <h1>${esc(PROFILE.name)}</h1>
  <p class="headline">${esc(PROFILE.headline)}</p>
  <p class="contact">
    <span>${esc(CONTACT.location)}</span>
    <span>${esc(CONTACT.phone)}</span>
    <span><a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a></span>
    <span>${link(CONTACT.site)}</span>
    <span>${link(PROFILE.linkedin)}</span>
    <span>${link(PROFILE.github)}</span>
  </p>
</header>

<section>
  <h2>${L.profile}</h2>
  <p>${esc(L.summary)}</p>
</section>

<section>
  <h2>${L.skills}</h2>
  <ul class="skills">
    ${skills.map((g) => `<li><b>${esc(g.label)}${L.colon}</b> ${g.items.map(esc).join(", ")}</li>`).join("\n    ")}
  </ul>
</section>

<section>
  <h2>${L.experience}</h2>
  ${jobs
    .map(
      (j) => `<div class="entry">
    <div class="head"><h3>${esc(j.role)}</h3><span class="date">${esc(L.period(j.period))}</span></div>
    <p class="org">${esc(j.company)}, ${esc(j.location)} (${esc(j.type.toLowerCase())})</p>
    <p class="summary">${esc(j.summary)}</p>
    <ul>
      ${[...j.responsibilities, ...j.achievements].map((r) => `<li>${esc(r)}</li>`).join("\n      ")}
    </ul>
    ${j.skills.length ? `<p class="tech"><b>${L.environment}${L.colon}</b> ${j.skills.map(esc).join(", ")}</p>` : ""}
  </div>`,
    )
    .join("\n  ")}
</section>

<section>
  <h2>${L.projects}</h2>
  ${projects
    .map(
      (p) => `<div class="entry">
    <div class="head"><h3>${esc(p.name)}${p.url ? `, ${link(p.url)}` : ""}</h3><span class="date">${esc(p.year)}</span></div>
    <p class="summary">${esc(p.desc)}</p>
    <p class="tech"><b>${L.technologies}${L.colon}</b> ${p.tech.map(esc).join(", ")}</p>
  </div>`,
    )
    .join("\n  ")}
</section>

<section>
  <h2>${L.education}</h2>
  ${education
    .map(
      (e) => `<div class="entry">
    <div class="head"><h3>${esc(e.role)}</h3><span class="date">${esc(e.period)}</span></div>
    <p class="org">${esc(e.summary.replace(/\.$/, ""))} (ISPM), ${esc(e.location)}</p>
  </div>`,
    )
    .join("\n  ")}
</section>

<section>
  <h2>${L.spokenLanguages}</h2>
  <p>${PROFILE.languages.map((l) => `${esc(l.name)}${L.colon} ${esc(l.level.toLowerCase())}`).join(" | ")}</p>
</section>
</body>
</html>
`;
  return { html, output: resolve(`public${PROFILE.cv}`) };
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error("Chrome introuvable : définis CHROME_PATH.");
  return found;
}

const chrome = findChrome();
const dir = mkdtempSync(join(tmpdir(), "cv-"));
try {
  for (const locale of LOCALES) {
    const { html, output } = render(locale);
    const file = join(dir, `cv-${locale}.html`);
    writeFileSync(file, html);
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--user-data-dir=${join(dir, "profile")}`,
        `--print-to-pdf=${output}`,
        pathToFileURL(file).href,
      ],
      { stdio: "ignore" },
    );
    console.log(`CV généré (${locale}) : ${output}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
