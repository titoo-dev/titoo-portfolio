import Image from "next/image";
import Link from "next/link";
import { Globe } from "@/components/motion/globe";
import { HeroBeams } from "@/components/motion/hero-beams";
import { SERVICE_ICONS } from "@/components/motion/service-icons";
import { Timeline } from "@/components/motion/timeline";
import { CopyEmail } from "@/components/site/copy-email";
import { StatusDot } from "@/components/site/footer";
import {
  ArrowRight,
  ArrowUpRight,
  GithubIcon,
  LinkedinIcon,
} from "@/components/site/icons";
import { InView } from "@/components/site/in-view";
import { Section } from "@/components/site/section";
import {
  careers,
  PROFILE,
  projects,
  services,
  stack,
} from "@/lib/portfolio-data";

const STATS = [
  { value: "4+", label: "ans d'expérience" },
  { value: "4", label: "entreprises" },
  { value: "15 000+", label: "chansons indexées sur Tononkira" },
  { value: "Licence", label: "ingénierie logicielle · ISPM" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1080px] border-line border-x">
      <Hero />
      <Stats />
      <Projects />
      <Services />
      <Experience />
      <Stack />
      <Contact />
    </main>
  );
}

function Hero() {
  return (
    <section className="grid md:grid-cols-[1.15fr_1fr]">
      <div className="flex flex-col justify-center px-6 py-16 md:px-10 md:py-24">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-muted text-xs">
          <StatusDot />
          Disponible — remote ou hybride
        </p>
        <h1 className="mt-6 text-balance font-semibold text-[40px] leading-[1.04] tracking-[-0.045em] md:text-[58px]">
          Des produits web & mobile, du pixel à la prod.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted leading-relaxed">
          Je suis Titosy, développeur fullstack JavaScript & Flutter à
          Antananarivo. J'interviens à chaque étape d'un projet, du cadrage des
          besoins à la mise en production, pour livrer des solutions simples et
          efficaces.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#projets"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 font-medium text-bg text-sm transition-opacity hover:opacity-85"
          >
            Voir les projets
            <ArrowRight width={15} height={15} />
          </Link>
          <Link
            href="#contact"
            className="inline-flex h-11 items-center rounded-full border border-line px-5 font-medium text-sm transition-colors hover:border-line-strong hover:bg-subtle"
          >
            Me contacter
          </Link>
        </div>
        <p className="mt-10 font-mono text-faint text-xs">
          <span className="text-muted">Actuellement</span> — {PROFILE.now.title}{" "}
          {PROFILE.now.company}
        </p>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden border-line border-t px-8 py-12 md:border-t-0 md:border-l">
        <div className="dot-grid absolute inset-0" aria-hidden />
        <div className="relative w-full max-w-[380px]">
          <HeroBeams />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <div className="grid grid-cols-2 border-line border-t md:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={[
            "px-6 py-8 md:px-10",
            i % 2 === 0 ? "border-line border-r" : "",
            i < 2 ? "border-line border-b md:border-b-0" : "",
            i === 1 ? "md:border-r" : "",
          ].join(" ")}
        >
          <p className="font-semibold text-3xl tabular-nums tracking-[-0.04em]">
            {s.value}
          </p>
          <p className="mt-1 text-muted text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function Projects() {
  return (
    <Section
      id="projets"
      label="Projets"
      title="Des produits en ligne, utilisés pour de vrai."
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
            <Link
              href={`/projets/${p.slug}`}
              className="group block p-6 md:p-8"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-subtle">
                <Image
                  src={p.img}
                  alt={`Aperçu de ${p.name}`}
                  fill
                  sizes="(min-width: 768px) 480px, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-medium text-lg tracking-tight">{p.name}</h3>
                <span className="font-mono text-faint text-xs">{p.year}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-muted text-sm leading-relaxed">
                {p.desc}
              </p>
              <div className="mt-5 flex items-center justify-between font-mono text-faint text-xs">
                <span>{p.tag}</span>
                <span className="flex items-center gap-1 text-muted transition-colors group-hover:text-fg">
                  Étude de cas
                  <ArrowUpRight
                    width={13}
                    height={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </Link>
          </InView>
        ))}
      </div>
    </Section>
  );
}

function Services() {
  return (
    <Section label="Services" title="Ce que je peux faire pour vous.">
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

function Experience() {
  return (
    <Section
      id="experience"
      label="Expérience"
      title="Quatre ans à livrer, de l'agence au SaaS."
    >
      <Timeline items={careers} />
    </Section>
  );
}

function Stack() {
  return (
    <Section
      id="stack"
      label="Stack"
      title="Les outils que j'utilise au quotidien."
    >
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

function Contact() {
  return (
    <Section id="contact">
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-10 md:py-24">
          <p className="font-mono text-muted text-xs uppercase tracking-wider">
            Contact
          </p>
          <h2 className="mt-3 text-balance font-semibold text-4xl tracking-[-0.045em] md:text-5xl">
            Construisons quelque chose ensemble.
          </h2>
          <p className="mt-5 max-w-md text-muted leading-relaxed">
            Un produit à lancer, une app à reprendre ou une équipe à renforcer ?
            Je travaille en remote depuis Madagascar avec des équipes et des
            clients à l'international.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopyEmail email={PROFILE.email} />
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
          </div>
          <p className="mt-10 font-mono text-faint text-xs">
            {PROFILE.location.city}, {PROFILE.location.country} ·{" "}
            {PROFILE.location.coords}
          </p>
          <p className="mt-2 font-mono text-faint text-xs">
            {PROFILE.languages
              .map((l) => `${l.name} (${l.level.toLowerCase()})`)
              .join(" · ")}
          </p>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden border-line border-t px-8 py-12 md:border-t-0 md:border-l">
          <div className="dot-grid absolute inset-0" aria-hidden />
          <div className="relative w-full max-w-[360px]">
            <Globe />
          </div>
        </div>
      </div>
    </Section>
  );
}
