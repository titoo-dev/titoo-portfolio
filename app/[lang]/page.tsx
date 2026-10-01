import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroBeams } from "@/components/motion/hero-beams";
import { ProjectPipeline } from "@/components/motion/project-pipeline";
import { SERVICE_ICONS } from "@/components/motion/service-icons";
import { Timeline } from "@/components/motion/timeline";
import { CopyEmail } from "@/components/site/copy-email";
import { StatusDot } from "@/components/site/footer";
import {
  ArrowRight,
  ArrowUpRight,
  DownloadIcon,
  GithubIcon,
  LinkedinIcon,
} from "@/components/site/icons";
import { InView } from "@/components/site/in-view";
import { ProjectVideo } from "@/components/site/project-video";
import { Section } from "@/components/site/section";
import { type Dictionary, format, getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale, projectPath } from "@/lib/i18n";
import { type Content, getContent } from "@/lib/portfolio-data";

type Ctx = { lang: Locale; t: Dictionary; content: Content };

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx: Ctx = { lang, t: getDictionary(lang), content: getContent(lang) };

  return (
    <main className="mx-auto max-w-[1080px] border-line border-x">
      <Hero {...ctx} />
      <Projects {...ctx} />
      <Services {...ctx} />
      <Experience {...ctx} />
      <Stack {...ctx} />
      <Contact {...ctx} />
    </main>
  );
}

function Hero({ t, content }: Ctx) {
  return (
    <section className="grid md:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col justify-center px-6 py-16 md:px-10 md:py-24">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-muted text-xs">
          <StatusDot />
          {t.status.remote}
        </p>
        <h1 className="mt-6 text-balance font-semibold text-[40px] leading-[1.04] tracking-[-0.045em] md:text-[58px]">
          {t.hero.title}
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted leading-relaxed">
          {t.hero.intro}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`#${t.ids.projects}`}
            data-avatar-mood="focused"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 font-medium text-bg text-sm transition-opacity hover:opacity-85"
          >
            {t.hero.projects}
            <ArrowRight width={15} height={15} />
          </Link>
          <Link
            href={`#${t.ids.contact}`}
            data-avatar-mood="happy"
            data-avatar-fire="wave"
            className="inline-flex h-11 items-center rounded-full border border-line px-5 font-medium text-sm transition-colors hover:border-line-strong hover:bg-subtle"
          >
            {t.hero.contact}
          </Link>
          <CvButton href={content.PROFILE.cv} label={t.cv.download} />
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden border-line border-t px-8 py-12 md:border-t-0 md:border-l">
        <div className="dot-grid absolute inset-0" aria-hidden />
        <div className="relative w-full max-w-[380px]">
          <HeroBeams
            label={t.hero.diagram}
            thoughts={t.hero.thoughts}
            replies={t.hero.replies}
          />
        </div>
      </div>
    </section>
  );
}

function Projects({ lang, t, content: { projects } }: Ctx) {
  return (
    <Section
      id={t.ids.projects}
      label={t.projects.label}
      title={t.projects.title}
    >
      <div className="grid border-line border-t md:grid-cols-2">
        {projects.map((p, i) => (
          <InView
            key={p.slug}
            className={[
              "reveal border-line",
              i < projects.length - 1 ? "border-b" : "",
              i === projects.length - 2 ? "md:border-b-0" : "",
              i % 2 === 0 ? "md:border-r" : "",
            ].join(" ")}
            style={{ transitionDelay: `${(i % 2) * 90}ms` }}
          >
            <div className="group p-6 md:p-8">
              {p.video ? (
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-subtle">
                  <ProjectVideo
                    src={p.video.src}
                    poster={p.video.poster}
                    captions={p.video.captions}
                    lang={lang}
                    title={p.name}
                    labels={{
                      video: format(t.projects.previewAlt, { name: p.name }),
                      play: format(t.projects.playVideo, { name: p.name }),
                      close: t.projects.closeVideo,
                    }}
                  />
                </div>
              ) : (
                <Link
                  href={projectPath(lang, p.slug)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative block aspect-[16/10] overflow-hidden rounded-lg border border-line bg-subtle"
                >
                  <Image
                    src={p.img}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 480px, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </Link>
              )}
              <Link href={projectPath(lang, p.slug)} className="block">
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-lg tracking-tight">
                    {p.name}
                  </h3>
                  <span className="font-mono text-faint text-xs">{p.year}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-muted text-sm leading-relaxed">
                  {p.desc}
                </p>
                <div className="mt-5 flex items-center justify-between font-mono text-faint text-xs">
                  <span>{p.tag}</span>
                  <span className="flex items-center gap-1 text-muted transition-colors group-hover:text-fg">
                    {t.projects.caseStudy}
                    <ArrowUpRight
                      width={13}
                      height={13}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            </div>
          </InView>
        ))}
      </div>
    </Section>
  );
}

function Services({ t, content: { services } }: Ctx) {
  return (
    <Section label={t.services.label} title={t.services.title}>
      <div className="grid border-line border-t sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => {
          const Icon = SERVICE_ICONS[i];
          return (
            <InView
              key={s.label}
              threshold={0.4}
              className={[
                "border-line px-6 py-8 md:px-8",
                i < services.length - 1 ? "border-b lg:border-b-0" : "",
                i === 2 ? "sm:border-b-0" : "",
                i % 2 === 0 ? "sm:border-r" : "",
                i === 1 ? "lg:border-r" : "",
              ].join(" ")}
            >
              <div className="text-fg">{Icon && <Icon />}</div>
              <h3 className="mt-6 font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 text-muted text-sm leading-relaxed">
                {s.body}
              </p>
              <ul className="mt-5 space-y-1.5 font-mono text-faint text-xs">
                {s.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </InView>
          );
        })}
      </div>
    </Section>
  );
}

function Experience({ t, content: { careers } }: Ctx) {
  return (
    <Section
      id={t.ids.experience}
      label={t.experience.label}
      title={t.experience.title}
    >
      <Timeline items={careers} detailsLabel={t.experience.details} />
    </Section>
  );
}

function Stack({ t, content: { stack } }: Ctx) {
  return (
    <Section id={t.ids.stack} label={t.stack.label} title={t.stack.title}>
      <dl className="border-line border-t">
        {stack.map((g, i) => (
          <InView
            key={g.label}
            className={[
              "reveal grid gap-3 px-6 py-6 md:grid-cols-[200px_1fr] md:px-10",
              i < stack.length - 1 ? "border-line border-b" : "",
            ].join(" ")}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <dt className="font-mono text-muted text-xs uppercase tracking-wider md:pt-1">
              {g.label}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line px-3 py-1 text-sm transition-colors hover:border-line-strong hover:bg-subtle"
                >
                  {item}
                </span>
              ))}
            </dd>
          </InView>
        ))}
      </dl>
    </Section>
  );
}

function Contact({ t, content: { PROFILE } }: Ctx) {
  return (
    <Section id={t.ids.contact}>
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-10 md:py-24">
          <p className="font-mono text-muted text-xs uppercase tracking-wider">
            {t.contact.label}
          </p>
          <h2 className="mt-3 text-balance font-semibold text-4xl tracking-[-0.045em] md:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mt-5 max-w-md text-muted leading-relaxed">
            {t.contact.body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmail
              email={PROFILE.email}
              copyLabel={t.contact.copy}
              copiedLabel={t.contact.copied}
            />
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <LinkedinIcon />
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <GithubIcon />
            </a>
            <CvButton href={PROFILE.cv} label={t.cv.download} />
          </div>
          <p className="mt-10 font-mono text-faint text-xs">
            {PROFILE.languages
              .map((l) => `${l.name} (${l.level.toLowerCase()})`)
              .join(" · ")}
          </p>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden border-line border-t px-8 py-12 md:border-t-0 md:border-l">
          <div className="dot-grid absolute inset-0" aria-hidden />
          <div className="relative w-full max-w-[360px]">
            <ProjectPipeline t={t.pipeline} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function CvButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      data-avatar-mood="surprised"
      data-avatar-fire="celebrate"
      className="group inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 font-medium text-sm transition-colors hover:border-line-strong hover:bg-subtle"
    >
      <DownloadIcon
        width={15}
        height={15}
        className="transition-transform group-hover:translate-y-0.5"
      />
      {label}
    </a>
  );
}
