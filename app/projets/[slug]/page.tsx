import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GithubIcon,
} from "@/components/site/icons";
import { InView } from "@/components/site/in-view";
import { Section } from "@/components/site/section";
import { getProject, projects } from "@/lib/portfolio-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.desc,
    alternates: { canonical: `/projets/${project.slug}` },
    openGraph: {
      title: `${project.name} | Titosy Manankasina`,
      description: project.desc,
      images: [project.img],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="mx-auto max-w-[1080px] border-line border-x">
      <section className="px-6 pt-10 pb-14 md:px-10 md:pt-14">
        <Link
          href="/#projets"
          className="inline-flex items-center gap-1.5 font-mono text-muted text-xs transition-colors hover:text-fg"
        >
          <ArrowLeft width={13} height={13} />
          Tous les projets
        </Link>
        <p className="mt-10 font-mono text-muted text-xs">
          {project.type} · {project.year}
        </p>
        <h1 className="mt-3 font-semibold text-5xl tracking-[-0.05em] md:text-6xl">
          {project.name}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted leading-relaxed">
          {project.overview}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 font-medium text-bg text-sm transition-opacity hover:opacity-85"
            >
              Voir le site
              <ArrowUpRight width={14} height={14} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-medium text-sm transition-colors hover:border-line-strong hover:bg-subtle"
            >
              <GithubIcon width={14} height={14} />
              Code source
            </a>
          )}
        </div>
      </section>

      <div className="grid grid-cols-3 border-line border-t">
        {project.stats.map((s, i) => (
          <div
            key={s.v}
            className={`px-6 py-6 md:px-10 ${i < 2 ? "border-line border-r" : ""}`}
          >
            <p className="font-semibold text-xl tracking-[-0.03em] md:text-2xl">
              {s.k}
            </p>
            <p className="mt-1 text-muted text-xs md:text-sm">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="border-line border-t bg-subtle p-4 md:p-10">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-bg">
          <Image
            src={project.img}
            alt={`Capture principale de ${project.name}`}
            fill
            priority
            sizes="(min-width: 1080px) 1000px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      <Section label="Points clés">
        <div className="grid gap-10 px-6 pb-14 md:grid-cols-[1fr_240px] md:px-10">
          <ol className="space-y-5">
            {project.highlights.map((h, i) => (
              <li key={h} className="flex gap-4 leading-relaxed">
                <span className="pt-0.5 font-mono text-faint text-xs tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
          <div>
            <p className="font-mono text-muted text-xs uppercase tracking-wider">
              Technologies
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line px-3 py-1 text-sm"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section label="Galerie">
        <div className="grid gap-4 px-6 pb-14 sm:grid-cols-2 md:px-10">
          {project.gallery.slice(1).map((src, i) => (
            <InView
              key={src}
              className="reveal relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-subtle"
              style={{ transitionDelay: `${(i % 2) * 90}ms` }}
            >
              <Image
                src={src}
                alt={`${project.name}, capture ${i + 2}`}
                fill
                sizes="(min-width: 768px) 500px, 100vw"
                className="object-cover object-top"
              />
            </InView>
          ))}
        </div>
      </Section>

      <Link
        href={`/projets/${next.slug}`}
        className="group relative flex items-center justify-between border-line border-t px-6 py-10 md:px-10"
      >
        <div>
          <p className="font-mono text-muted text-xs">Projet suivant</p>
          <p className="mt-2 font-semibold text-2xl tracking-[-0.035em]">
            {next.name}
          </p>
        </div>
        <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:border-line-strong group-hover:bg-subtle">
          <ArrowRight
            width={16}
            height={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </Link>
    </main>
  );
}
