import Image from "next/image";
import Link from "next/link";
import { LocalTime } from "@/components/local-time";
import {
  Crosshair,
  PixelAsterisk,
  PixelBot,
  PixelDrift,
  PixelHeart,
  SignatureWave,
} from "@/components/pixel";
import { ProjectList } from "@/components/project-list";
import cvData from "@/cv.json";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "aujourd'hui";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
}

type SkillEntry = { name: string; keywords: string[] };

function groupSkills(skills: SkillEntry[]) {
  const groups: Record<string, string[]> = {
    Web: [],
    Mobile: [],
    "Backend & data": [],
    Outils: [],
  };
  for (const skill of skills) {
    const kw = skill.keywords.join(" ");
    if (/Mobile Development|Android/.test(kw)) groups.Mobile.push(skill.name);
    else if (
      /Backend|Databases|Server|Serverless|Cloud/.test(kw) &&
      !/Frontend|Front-end/.test(kw)
    )
      groups["Backend & data"].push(skill.name);
    else if (/Web Development|Frontend|Front-end/.test(kw))
      groups.Web.push(skill.name);
    else groups.Outils.push(skill.name);
  }
  return groups;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const services = [
  {
    title: "Développement web",
    description: "Applications web modernes et performantes.",
    features: ["React / Next.js", "TypeScript", "PWA", "Intégration API"],
  },
  {
    title: "Applications mobile",
    description: "Apps cross-platform fluides sur iOS et Android.",
    features: ["Flutter", "UI/UX mobile", "Firebase", "App Store / Play Store"],
  },
  {
    title: "Design UI/UX",
    description: "Interfaces élégantes, accessibles, pensées sur Figma.",
    features: ["Prototypage", "Design system", "Responsive", "Accessibilité"],
  },
  {
    title: "Consulting & formation",
    description: "Accompagnement technique et montée en compétence d'équipes.",
    features: ["Audit", "Formation React / Flutter", "Code review"],
  },
];

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function Section({
  n,
  title,
  id,
  stagger,
  children,
}: {
  n: string;
  title: string;
  id: string;
  stagger: number;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="enter mt-24 scroll-mt-8"
      style={{ "--stagger": stagger } as React.CSSProperties}
    >
      <div className="mb-9 flex items-baseline gap-4">
        <h2 className="section-title">
          <span className="text-accent">{n}</span>
          <span className="mx-2 text-hairline-strong" aria-hidden>
            /
          </span>
          {title}
        </h2>
        <span
          className="rule-draw h-px flex-1 self-center bg-hairline"
          aria-hidden
        />
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home() {
  const { basics, work, projects, skills, education, languages } = cvData;
  const skillGroups = groupSkills(skills);
  const github = basics.profiles.find((p) => p.network === "GitHub");
  const linkedin = basics.profiles.find((p) => p.network === "LinkedIn");

  return (
    <main className="relative mx-auto max-w-[880px] px-6 py-16 md:py-28">
      {/* Drafting-guide crosshairs + floating pixel decorations */}
      <Crosshair className="absolute -left-10 top-16 hidden lg:block" />
      <Crosshair className="absolute -right-10 top-16 hidden lg:block" />
      <PixelDrift className="absolute -left-10 top-[420px] hidden lg:flex" />
      <PixelDrift className="absolute -right-10 top-[680px] hidden lg:flex" />

      {/* =================================================================== */}
      {/* HEADER                                                              */}
      {/* =================================================================== */}
      <header
        id="a-propos"
        className="enter"
        style={{ "--stagger": 0 } as React.CSSProperties}
      >
        <div className="label flex items-center justify-between">
          <span className="flex items-center gap-2 text-fg">
            <span className="text-accent">
              <PixelAsterisk />
            </span>
            titosy.dev
          </span>
          <span>
            <LocalTime /> — Antananarivo, MG
          </span>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start gap-10 md:mt-16 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="max-w-[480px]">
            <h1 className="font-pixel text-[33px] leading-tight md:text-[44px]">
              {basics.name}
            </h1>
            <p className="mt-3 font-mono text-[15px] text-muted md:text-[16px]">
              {basics.label}
            </p>

            <SignatureWave className="mt-7 text-accent" />

            <p className="label mt-8 flex items-center gap-2">
              <span
                className="blink inline-block size-2 bg-accent-bright"
                aria-hidden
              />
              Disponible — remote ou hybride
            </p>
          </div>

          {/* Pixel-art portrait — the page background is sampled from this
              image, so the masked edges melt straight into the page. */}
          <Image
            src="/me-pixel.png"
            alt={`Portrait pixel art de ${basics.name}`}
            width={320}
            height={344}
            priority
            className="w-[240px] shrink-0 md:w-[320px]"
            style={{
              maskImage:
                "radial-gradient(110% 105% at 50% 42%, #000 52%, transparent 97%)",
              WebkitMaskImage:
                "radial-gradient(110% 105% at 50% 42%, #000 52%, transparent 97%)",
            }}
          />
        </div>

        <p className="mt-10 max-w-[640px] text-[17px] leading-relaxed text-muted">
          {basics.summary}
        </p>

        <nav className="mt-7 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[15px]">
          {github && (
            <Link
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              GitHub
            </Link>
          )}
          {linkedin && (
            <Link
              href={linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              LinkedIn
            </Link>
          )}
          <Link href={`mailto:${basics.email}`} className="link">
            Email
          </Link>
          <Link
            href={`tel:${basics.phone.replace(/\s/g, "")}`}
            className="link"
          >
            Téléphone
          </Link>
        </nav>
      </header>

      {/* =================================================================== */}
      {/* SERVICES                                                            */}
      {/* =================================================================== */}
      <Section n="01" title="Services" id="services" stagger={1}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
          {services.map((service) => (
            <div key={service.title}>
              <h3 className="font-mono text-[15px] font-medium">
                {service.title}
              </h3>
              <p className="mt-1 text-[15.5px] leading-relaxed text-muted">
                {service.description}
              </p>
              <p className="label mt-1.5 normal-case tracking-normal">
                {service.features.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* =================================================================== */}
      {/* EXPÉRIENCE                                                          */}
      {/* =================================================================== */}
      <Section n="02" title="Expérience" id="experience" stagger={2}>
        <div className="flex flex-col gap-10">
          {work.map((job) => (
            <article key={`${job.name}-${job.startDate}`}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-mono text-[15px] font-medium">
                  {job.position}
                </h3>
                {"url" in job && job.url ? (
                  <Link
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link font-mono text-[14px] text-muted"
                  >
                    @ {job.name}
                  </Link>
                ) : (
                  <span className="font-mono text-[14px] text-muted">
                    @ {job.name}
                  </span>
                )}
              </div>
              <p className="label mt-1">
                {formatDate(job.startDate)} → {formatDate(job.endDate)} ·{" "}
                {job.location_type}
                {!job.endDate && (
                  <span className="ml-2 text-accent">[en cours]</span>
                )}
              </p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-muted">
                {job.summary}
              </p>

              {job.responsibilities.length > 0 && (
                <details className="group mt-2">
                  <summary className="label cursor-pointer list-none select-none transition-colors duration-150 hover:text-fg [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-accent">
                      <span className="group-open:hidden">[+]</span>
                      <span className="hidden group-open:inline">[−]</span>
                    </span>{" "}
                    détails
                  </summary>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {job.responsibilities.map((r) => (
                      <li
                        key={r}
                        className="flex gap-2.5 text-[15px] leading-relaxed text-muted"
                      >
                        <span
                          className="mt-2 size-1 shrink-0 bg-faint"
                          aria-hidden
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              {job.skills.length > 0 && (
                <p className="label mt-2 normal-case tracking-normal">
                  {job.skills.join(" · ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* =================================================================== */}
      {/* PROJETS                                                             */}
      {/* =================================================================== */}
      <Section n="03" title="Projets" id="projets" stagger={3}>
        <ProjectList projects={projects} />
      </Section>

      {/* =================================================================== */}
      {/* COMPÉTENCES                                                         */}
      {/* =================================================================== */}
      <Section n="04" title="Compétences" id="competences" stagger={4}>
        <dl className="flex flex-col gap-4">
          {Object.entries(skillGroups).map(
            ([group, names]) =>
              names.length > 0 && (
                <div
                  key={group}
                  className="grid grid-cols-[150px_1fr] items-baseline gap-4"
                >
                  <dt className="label">{group}</dt>
                  <dd className="font-mono text-[15px] text-muted">
                    {names.join(" · ")}
                  </dd>
                </div>
              ),
          )}
        </dl>
      </Section>

      {/* =================================================================== */}
      {/* FORMATION                                                           */}
      {/* =================================================================== */}
      <Section n="05" title="Formation" id="formation" stagger={5}>
        {education.map((edu) => (
          <div key={edu.institution}>
            <h3 className="font-mono text-[15px] font-medium">
              {edu.studyType} — {edu.area}
            </h3>
            <p className="label mt-1">
              <Link
                href={edu.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {edu.institution}
              </Link>{" "}
              · {new Date(edu.startDate).getFullYear()} →{" "}
              {new Date(edu.endDate).getFullYear()}
            </p>
          </div>
        ))}
        <p className="label mt-4 normal-case tracking-normal">
          {languages
            .map((l) => `${l.language} (${l.fluency.toLowerCase()})`)
            .join(" · ")}
        </p>
      </Section>

      {/* =================================================================== */}
      {/* CONTACT / FOOTER                                                    */}
      {/* =================================================================== */}
      <footer
        className="enter mt-24 border-t border-hairline pt-12 pb-4"
        style={{ "--stagger": 6 } as React.CSSProperties}
      >
        <div className="flex items-center gap-5">
          <span className="text-accent">
            <PixelBot size={40} />
          </span>
          <h2 className="font-pixel text-[33px] leading-tight md:text-[44px]">
            Travaillons ensemble<span className="blink text-accent">_</span>
          </h2>
        </div>
        <p className="mt-5 max-w-[640px] text-[16px] leading-relaxed text-muted">
          Un projet en tête ? Je suis disponible pour des missions freelance ou
          des collaborations long terme.
        </p>
        <p className="mt-6">
          <Link
            href={`mailto:${basics.email}`}
            className="link font-mono text-[17px] text-accent"
          >
            {basics.email}
          </Link>
        </p>

        <div className="label mt-14 flex flex-wrap items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} {basics.name}
          </span>
          <span className="flex items-center gap-1.5">
            Conçu avec{" "}
            <span className="text-accent">
              <PixelHeart />
            </span>{" "}
            à Madagascar
          </span>
        </div>
      </footer>
    </main>
  );
}
