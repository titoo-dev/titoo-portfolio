// Generates public/cv-titosy-manankasina.pdf from lib/portfolio-data.ts.
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
import { careers, PROFILE, projects, stack } from "../lib/portfolio-data.ts";

const OUTPUT = resolve("public/cv-titosy-manankasina.pdf");

// Contact details only printed on the CV (not shown on the site).
const CONTACT = {
  location: "Antananarivo, Madagascar",
  phone: "+261 38 80 322 74",
  site: "https://titosy.dev",
};

// Keywords ATS match against, grouped for a human reader.
const SKILLS = [
  {
    label: "Langages",
    items: ["JavaScript", "TypeScript", "Dart", "Kotlin", "SQL"],
  },
  ...stack,
  {
    label: "Méthodes",
    items: ["Scrum", "Micro-frontends", "Monorepo", "Revue de code"],
  },
];

const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const bare = (url) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const link = (url) => `<a href="${esc(url)}">${esc(bare(url))}</a>`;

/** "Depuis oct. 2025" -> "Oct. 2025 à aujourd'hui"; other ranges unchanged. */
const period = (p) =>
  p.startsWith("Depuis ")
    ? `${p[7].toUpperCase()}${p.slice(8)} à aujourd'hui`
    : p;

const jobs = careers.filter((c) => !c.isEdu);
const education = careers.filter((c) => c.isEdu);

const years = new Date().getFullYear() - 2022;

const profile = `Développeur fullstack JavaScript / Flutter avec plus de ${years} ans d'expérience dans la conception et la livraison d'applications web et mobiles (React, Next.js, Node.js, Flutter). J'interviens à toutes les étapes d'un projet, de l'analyse des besoins à la mise en production, avec une pratique DevOps (Kubernetes, Terraform, ArgoCD) et des solutions d'IA agentic. J'accompagne les clients dans le cadrage de leurs projets pour proposer des solutions adaptées, simples et efficaces.`;

const html = `<!doctype html>
<html lang="fr">
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
  <h2>Profil</h2>
  <p>${esc(profile)}</p>
</section>

<section>
  <h2>Compétences techniques</h2>
  <ul class="skills">
    ${SKILLS.map((g) => `<li><b>${esc(g.label)} :</b> ${g.items.map(esc).join(", ")}</li>`).join("\n    ")}
  </ul>
</section>

<section>
  <h2>Expérience professionnelle</h2>
  ${jobs
    .map(
      (j) => `<div class="entry">
    <div class="head"><h3>${esc(j.role)}</h3><span class="date">${esc(period(j.period))}</span></div>
    <p class="org">${esc(j.company)}, ${esc(j.location)} (${esc(j.type.toLowerCase())})</p>
    <p class="summary">${esc(j.summary)}</p>
    <ul>
      ${[...j.responsibilities, ...j.achievements].map((r) => `<li>${esc(r)}</li>`).join("\n      ")}
    </ul>
    ${j.skills.length ? `<p class="tech"><b>Environnement :</b> ${j.skills.map(esc).join(", ")}</p>` : ""}
  </div>`,
    )
    .join("\n  ")}
</section>

<section>
  <h2>Projets</h2>
  ${projects
    .map(
      (p) => `<div class="entry">
    <div class="head"><h3>${esc(p.name)}${p.url ? `, ${link(p.url)}` : ""}</h3><span class="date">${esc(p.year)}</span></div>
    <p class="summary">${esc(p.desc)}</p>
    <p class="tech"><b>Technologies :</b> ${p.tech.map(esc).join(", ")}</p>
  </div>`,
    )
    .join("\n  ")}
</section>

<section>
  <h2>Formation</h2>
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
  <h2>Langues</h2>
  <p>${PROFILE.languages.map((l) => `${esc(l.name)} : ${esc(l.level.toLowerCase())}`).join(" | ")}</p>
</section>
</body>
</html>
`;

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

const dir = mkdtempSync(join(tmpdir(), "cv-"));
try {
  const file = join(dir, "cv.html");
  writeFileSync(file, html);
  execFileSync(
    findChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${join(dir, "profile")}`,
      `--print-to-pdf=${OUTPUT}`,
      pathToFileURL(file).href,
    ],
    { stdio: "ignore" },
  );
  console.log(`CV généré : ${OUTPUT}`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
