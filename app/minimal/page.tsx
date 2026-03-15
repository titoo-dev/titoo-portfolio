"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import cvData from "@/cv.json";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const formatDate = (str: string) =>
  new Date(str).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
  });

/* ------------------------------------------------------------------ */
/*  Service data (inline — no card chrome, just text)                  */
/* ------------------------------------------------------------------ */

const services = [
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Développement Web",
    description:
      "Applications React, Next.js & TypeScript. Interfaces modernes, performantes, responsives.",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    title: "Applications Mobile",
    description:
      "Flutter & Dart. Expériences natives cross-platform, iOS et Android.",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="13.5" cy="6.5" r="2.5" />
        <path d="M17.5 13.5L22 19H2l6.5-8.5 4 5" />
      </svg>
    ),
    title: "Design UI/UX",
    description:
      "Prototypage Figma, design systems, interfaces accessibles et élégantes.",
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    title: "Consulting & Formation",
    description:
      "Audit technique, formation React & Flutter, accompagnement de vos équipes.",
  },
];

/* ------------------------------------------------------------------ */
/*  Fade-in wrapper                                                    */
/* ------------------------------------------------------------------ */

function Fade({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section label                                                      */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block mb-6"
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "oklch(0.55 0 0)",
      }}
    >
      {children}
    </span>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */

export default function MinimalPage() {
  /* Theme data attribute ------------------------------------------- */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "minimal");
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const { basics, work, projects, skills } = cvData;
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#fafaf9",
        color: "oklch(0.08 0 0)",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontWeight: 300,
      }}
    >
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        {/* ========================================================= */}
        {/*  HERO                                                      */}
        {/* ========================================================= */}
        <section className="pt-24 pb-20 md:pt-32 md:pb-24">
          {/* Availability */}
          <Fade>
            <div
              className="flex items-center gap-2 mb-8"
              style={{
                fontSize: "0.7rem",
                fontWeight: 400,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(0.55 0 0)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "oklch(0.55 0 0)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-1.5 w-1.5"
                  style={{ background: "oklch(0.45 0 0)" }}
                />
              </span>
              Disponible pour de nouveaux projets
            </div>
          </Fade>

          {/* Name + tiny avatar */}
          <Fade delay={0.1}>
            <div className="flex items-center gap-5 mb-5">
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{
                  width: "4rem",
                  height: "4rem",
                  borderRadius: "50%",
                  border: "1px solid oklch(0.85 0 0 / 0.5)",
                }}
              >
                <Image
                  src={basics.image}
                  alt={basics.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: "clamp(2.8rem, 8vw, 4.5rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "oklch(0.08 0 0)",
                }}
              >
                {basics.name}
              </h1>
            </div>
          </Fade>

          {/* Label */}
          <Fade delay={0.15}>
            <p
              className="mb-8"
              style={{
                fontSize: "0.82rem",
                fontWeight: 400,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "oklch(0.55 0 0)",
              }}
            >
              {basics.label}
            </p>
          </Fade>

          {/* Summary */}
          <Fade delay={0.2}>
            <p
              className="mb-10"
              style={{
                fontSize: "0.95rem",
                fontWeight: 300,
                lineHeight: 1.85,
                color: "oklch(0.35 0 0)",
                maxWidth: "52ch",
              }}
            >
              {basics.summary}
            </p>
          </Fade>

          {/* Social links as plain text */}
          <Fade delay={0.25}>
            <div className="flex flex-wrap gap-6">
              {basics.profiles.map((profile) => (
                <Link
                  key={profile.network}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors duration-500"
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "oklch(0.55 0 0)",
                    textDecoration: "none",
                  }}
                >
                  {profile.network}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Link>
              ))}
              <Link
                href={`mailto:${basics.email}`}
                className="inline-flex items-center gap-1.5 transition-colors duration-500"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "oklch(0.55 0 0)",
                  textDecoration: "none",
                }}
              >
                Email
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>
          </Fade>
        </section>

        {/* ========================================================= */}
        {/*  SERVICES                                                  */}
        {/* ========================================================= */}
        <section
          className="py-16"
          style={{ borderTop: "1px solid oklch(0.9 0 0 / 0.35)" }}
        >
          <Fade>
            <SectionLabel>Services</SectionLabel>
          </Fade>
          <Fade delay={0.05}>
            <h2
              className="mb-12"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Comment puis-je vous aider&nbsp;?
            </h2>
          </Fade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {services.map((service, i) => (
              <Fade key={i} delay={0.08 * i}>
                <div className="flex items-start gap-4">
                  <span
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "oklch(0.4 0 0)" }}
                  >
                    {service.icon}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 400,
                        fontSize: "1.15rem",
                        letterSpacing: "-0.01em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 300,
                        lineHeight: 1.7,
                        color: "oklch(0.45 0 0)",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/*  EXPERIENCE                                                */}
        {/* ========================================================= */}
        <section
          className="py-16"
          style={{ borderTop: "1px solid oklch(0.9 0 0 / 0.35)" }}
        >
          <Fade>
            <SectionLabel>Expérience</SectionLabel>
          </Fade>
          <Fade delay={0.05}>
            <h2
              className="mb-14"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Parcours professionnel
            </h2>
          </Fade>

          <div className="relative">
            {/* Barely-visible vertical line */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: "89px",
                width: "0.5px",
                background: "oklch(0.88 0 0 / 0.4)",
              }}
            />

            <div className="flex flex-col gap-0">
              {work.map((job, i) => (
                <Fade key={i} delay={0.08 * i}>
                  <div
                    className="flex gap-8 relative"
                    style={{
                      paddingTop: i === 0 ? 0 : "2rem",
                      borderTop:
                        i === 0
                          ? "none"
                          : "1px solid oklch(0.9 0 0 / 0.25)",
                      marginTop: i === 0 ? 0 : "2rem",
                    }}
                  >
                    {/* Date column */}
                    <div
                      className="flex-shrink-0 pt-0.5"
                      style={{
                        width: "80px",
                        fontSize: "0.72rem",
                        fontWeight: 400,
                        letterSpacing: "0.03em",
                        color: "oklch(0.55 0 0)",
                        lineHeight: 1.6,
                      }}
                    >
                      <span>{formatDate(job.startDate)}</span>
                      <br />
                      <span style={{ color: "oklch(0.7 0 0)" }}>
                        {job.endDate ? formatDate(job.endDate) : "Présent"}
                      </span>
                    </div>

                    {/* Timeline dot */}
                    <div
                      className="absolute"
                      style={{
                        left: "87.5px",
                        top: i === 0 ? "6px" : "calc(2rem + 6px)",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "oklch(0.08 0 0)",
                      }}
                    />

                    {/* Content */}
                    <div className="flex-1 pl-6">
                      <h3
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 400,
                          fontSize: "1.25rem",
                          letterSpacing: "-0.01em",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {job.position}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 400,
                          letterSpacing: "0.04em",
                          color: "oklch(0.5 0 0)",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {job.name}
                        {job.url && (
                          <>
                            {" "}
                            <Link
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "oklch(0.45 0 0)",
                                textDecoration: "underline",
                                textUnderlineOffset: "2px",
                                textDecorationThickness: "0.5px",
                              }}
                            >
                              &rarr;
                            </Link>
                          </>
                        )}
                        <span style={{ color: "oklch(0.7 0 0)" }}>
                          {" "}
                          &middot; {job.location_type} &middot; {job.location}
                        </span>
                      </p>

                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 300,
                          lineHeight: 1.75,
                          color: "oklch(0.4 0 0)",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {job.summary}
                      </p>

                      {/* Skills as dot-separated text */}
                      {job.skills && job.skills.length > 0 && (
                        <p
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 300,
                            letterSpacing: "0.04em",
                            color: "oklch(0.55 0 0)",
                            lineHeight: 1.8,
                          }}
                        >
                          {job.skills.map((skill, si) => (
                            <span key={si}>
                              {skill}
                              {si < job.skills.length - 1 && (
                                <span
                                  style={{
                                    color: "oklch(0.75 0 0)",
                                    padding: "0 0.4em",
                                  }}
                                >
                                  &middot;
                                </span>
                              )}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/*  PROJECTS / PORTFOLIO                                      */}
        {/* ========================================================= */}
        <section
          className="py-16"
          style={{ borderTop: "1px solid oklch(0.9 0 0 / 0.35)" }}
        >
          <Fade>
            <SectionLabel>Portfolio</SectionLabel>
          </Fade>
          <Fade delay={0.05}>
            <h2
              className="mb-14"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Projets sélectionnés
            </h2>
          </Fade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14">
            {projects
              .filter(
                (p) =>
                  (p.images && p.images.length > 0) || p.url
              )
              .map((project, i) => (
                <Fade key={i} delay={0.08 * i}>
                  <div className="group">
                    {/* Image */}
                    {project.images && project.images.length > 0 && (
                      <div
                        className="relative w-full overflow-hidden mb-4"
                        style={{
                          aspectRatio: "16 / 10",
                          borderRadius: 0,
                        }}
                      >
                        <Image
                          src={project.images[0]}
                          alt={project.name}
                          fill
                          className="object-cover transition-all duration-700"
                          style={{
                            filter: "grayscale(30%)",
                          }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{
                            background:
                              "linear-gradient(to top, oklch(0.08 0 0 / 0.08), transparent)",
                          }}
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3
                      className="transition-colors duration-500"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 400,
                        fontSize: "1.2rem",
                        letterSpacing: "-0.01em",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {project.url ? (
                        <Link
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5"
                          style={{
                            color: "oklch(0.08 0 0)",
                            textDecoration: "none",
                          }}
                        >
                          {project.name}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </Link>
                      ) : (
                        project.name
                      )}
                    </h3>

                    {/* Description — 2 lines */}
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 300,
                        lineHeight: 1.65,
                        color: "oklch(0.45 0 0)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.description}
                    </p>
                  </div>
                </Fade>
              ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/*  SKILLS                                                    */}
        {/* ========================================================= */}
        <section
          className="py-16"
          style={{ borderTop: "1px solid oklch(0.9 0 0 / 0.35)" }}
        >
          <Fade>
            <SectionLabel>Compétences</SectionLabel>
          </Fade>
          <Fade delay={0.05}>
            <h2
              className="mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Technologies
            </h2>
          </Fade>

          <Fade delay={0.1}>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 300,
                lineHeight: 2,
                color: "oklch(0.4 0 0)",
                letterSpacing: "0.02em",
              }}
            >
              {skills.map((skill, i) => (
                <span key={i}>
                  {skill.name}
                  {i < skills.length - 1 && (
                    <span
                      style={{
                        color: "oklch(0.75 0 0)",
                        padding: "0 0.5em",
                        fontWeight: 300,
                      }}
                    >
                      &middot;
                    </span>
                  )}
                </span>
              ))}
            </p>
          </Fade>
        </section>

        {/* ========================================================= */}
        {/*  FOOTER                                                    */}
        {/* ========================================================= */}
        <footer
          className="py-12"
          style={{ borderTop: "1px solid oklch(0.9 0 0 / 0.35)" }}
        >
          <Fade>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 300,
                letterSpacing: "0.05em",
                color: "oklch(0.65 0 0)",
              }}
            >
              &copy; {currentYear} {basics.name}. Tous droits
              r&eacute;serv&eacute;s.
            </p>
          </Fade>
        </footer>
      </div>
    </div>
  );
}
