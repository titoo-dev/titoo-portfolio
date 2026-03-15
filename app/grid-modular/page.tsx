"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";
import cvData from "@/cv.json";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Aujourd'hui";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const services = [
  {
    title: "Developpement Web",
    description:
      "Applications React / Next.js performantes, sites responsives, Progressive Web Apps et integration API.",
  },
  {
    title: "Applications Mobile",
    description:
      "Applications Flutter cross-platform, integration Firebase, publication App Store & Play Store.",
  },
  {
    title: "Design UI/UX",
    description:
      "Prototypage Figma, design systems, interfaces accessibles et responsive.",
  },
  {
    title: "Consulting & Formation",
    description:
      "Audit technique, formation React/Flutter, code review et best practices.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GridModularPage() {
  /* Set data-theme on mount, clean up on unmount */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "grid-modular");
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const { basics, work, projects, skills } = cvData;
  const currentYear = new Date().getFullYear();

  // -----------------------------------------------------------------------
  // Framer Motion helpers -- restrained, editorial
  // -----------------------------------------------------------------------
  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true } as const,
    transition: { duration: 0.4, ease: "easeOut" as const },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true } as const,
    transition: { duration: 0.35, ease: "easeOut" as const },
  };

  return (
    <>
      {/* -------------------------------------------------------------- */}
      {/* Body-level grid overlays via <style> tag                        */}
      {/* -------------------------------------------------------------- */}
      <style>{`
        html[data-theme="grid-modular"] body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent calc((100vw / 12) - 1px),
            rgba(0,0,0,0.04) calc((100vw / 12) - 1px),
            rgba(0,0,0,0.04) calc(100vw / 12)
          );
          pointer-events: none;
          z-index: 0;
        }
        html[data-theme="grid-modular"] body::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 31px,
            rgba(0,0,0,0.018) 31px,
            rgba(0,0,0,0.018) 32px
          );
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          backgroundColor: "transparent",
        }}
      >
        {/* ============================================================ */}
        {/* CONTENT CONTAINER -- magazine spine                           */}
        {/* ============================================================ */}
        <div
          style={{
            maxWidth: "64rem",
            marginLeft: "auto",
            marginRight: "auto",
            borderLeft: "1px solid rgba(0,0,0,0.12)",
            borderRight: "1px solid rgba(0,0,0,0.12)",
            backgroundColor: "#F5F2EE",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ========================================================== */}
          {/* HERO -- EDITORIAL MASTHEAD                                  */}
          {/* ========================================================== */}
          <section
            style={{
              padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem) 0",
              borderBottom: "3px solid #1A1A1A",
            }}
          >
            {/* Classification line */}
            <motion.div
              {...fadeIn}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: "#6B6560",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
                marginBottom: "2.5rem",
              }}
            >
              Portfolio &mdash; Vol. I
            </motion.div>

            {/* Hero flex: image + text */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                gap: "clamp(2rem,5vw,4rem)",
                paddingBottom: "clamp(2.5rem,4vw,4rem)",
              }}
            >
              {/* Profile image with registration marks */}
              <motion.div
                {...fadeUp}
                style={{ position: "relative", flexShrink: 0 }}
              >
                {/* Top-left bracket */}
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    left: -6,
                    width: 14,
                    height: 14,
                    borderTop: "1px solid #1A1A1A",
                    borderLeft: "1px solid #1A1A1A",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                {/* Bottom-right bracket */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    width: 14,
                    height: 14,
                    borderBottom: "1px solid #1A1A1A",
                    borderRight: "1px solid #1A1A1A",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                {/* Top-right bracket */}
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 14,
                    height: 14,
                    borderTop: "1px solid #1A1A1A",
                    borderRight: "1px solid #1A1A1A",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                {/* Bottom-left bracket */}
                <span
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: -6,
                    width: 14,
                    height: 14,
                    borderBottom: "1px solid #1A1A1A",
                    borderLeft: "1px solid #1A1A1A",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    width: "9rem",
                    height: "9rem",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.18)",
                    background: "#E8E2D9",
                  }}
                >
                  <Image
                    src={basics.image}
                    alt={basics.name}
                    width={144}
                    height={144}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    priority
                  />
                </div>
              </motion.div>

              {/* Text block */}
              <div style={{ flex: 1, minWidth: 240 }}>
                <motion.h1
                  {...fadeUp}
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(3.5rem,8vw,5.5rem)",
                    fontWeight: 700,
                    fontStyle: "normal",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#1A1A1A",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {basics.name}
                </motion.h1>

                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  style={{
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.15em",
                    color: "#C41E3A",
                    marginTop: "0.75rem",
                  }}
                >
                  {basics.label}
                </motion.p>

                <motion.p
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    color: "#3D3D3D",
                    maxWidth: "52ch",
                    marginTop: "1.5rem",
                  }}
                >
                  {basics.summary}
                </motion.p>

                {/* Availability */}
                <motion.div
                  {...fadeIn}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1.5rem",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "#6B6560",
                  }}
                >
                  {/* Red square dot */}
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      backgroundColor: "#C41E3A",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  Disponible pour de nouveaux projets
                </motion.div>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* MODULE 01 -- SERVICES                                       */}
          {/* ========================================================== */}
          <section
            style={{
              padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <motion.div {...fadeIn}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#C41E3A",
                  color: "#FFFFFF",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  padding: "0.3rem 0.7rem",
                  marginBottom: "0.75rem",
                }}
              >
                01 / Services
              </span>
            </motion.div>

            <motion.h2
              {...fadeUp}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem,5vw,3.5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.1,
                borderBottom: "2px solid #1A1A1A",
                paddingBottom: "0.75rem",
                marginBottom: "2.5rem",
                color: "#1A1A1A",
              }}
            >
              Comment puis-je vous aider&nbsp;?
            </motion.h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {services.map((service, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                    padding: "1.75rem 0",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                      fontSize: "1.125rem",
                      fontWeight: 600,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.12em",
                      color: "#1A1A1A",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      color: "#6B6560",
                      maxWidth: "60ch",
                    }}
                  >
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* MODULE 02 -- EXPERIENCE                                     */}
          {/* ========================================================== */}
          <section
            style={{
              padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <motion.div {...fadeIn}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#C41E3A",
                  color: "#FFFFFF",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  padding: "0.3rem 0.7rem",
                  marginBottom: "0.75rem",
                }}
              >
                02 / Experience
              </span>
            </motion.div>

            <motion.h2
              {...fadeUp}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem,5vw,3.5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.1,
                borderBottom: "2px solid #1A1A1A",
                paddingBottom: "0.75rem",
                marginBottom: "2.5rem",
                color: "#1A1A1A",
              }}
            >
              Parcours professionnel
            </motion.h2>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {work.map((job, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "clamp(1.5rem,4vw,3rem)",
                    alignItems: "flex-start",
                    borderTop:
                      i === 0 ? "none" : "1px solid rgba(0,0,0,0.1)",
                    paddingTop: i === 0 ? 0 : "1.75rem",
                    paddingBottom: "2rem",
                  }}
                >
                  {/* Date column */}
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1rem",
                      fontStyle: "italic",
                      fontWeight: 400,
                      color: "#6B6560",
                      lineHeight: 1.4,
                      width: "11rem",
                      flexShrink: 0,
                      paddingTop: "0.2rem",
                    }}
                  >
                    {formatDate(job.startDate)} &mdash;{" "}
                    {formatDate(job.endDate ?? null)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 240 }}>
                    {/* Company */}
                    <h3
                      style={{
                        fontFamily:
                          "'Libre Franklin', Helvetica, sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.18em",
                        color: "#1A1A1A",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {job.url ? (
                        <Link
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1A1A1A",
                            borderBottom: "1px solid rgba(0,0,0,0.2)",
                            textDecoration: "none",
                          }}
                        >
                          {job.name}
                        </Link>
                      ) : (
                        job.name
                      )}
                    </h3>

                    {/* Position */}
                    <h4
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "1.25rem",
                        fontStyle: "italic",
                        fontWeight: 400,
                        color: "#1A1A1A",
                        letterSpacing: "-0.01em",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {job.position}
                    </h4>

                    {/* Summary */}
                    {job.summary && (
                      <p
                        style={{
                          fontFamily:
                            "'Libre Franklin', Helvetica, sans-serif",
                          fontSize: "0.9rem",
                          lineHeight: 1.65,
                          color: "#6B6560",
                          marginBottom: "0.75rem",
                          maxWidth: "55ch",
                        }}
                      >
                        {job.summary}
                      </p>
                    )}

                    {/* Responsibilities */}
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: "0 0 1rem 0",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                        }}
                      >
                        {job.responsibilities.map((r, ri) => (
                          <li
                            key={ri}
                            style={{
                              fontFamily:
                                "'Libre Franklin', Helvetica, sans-serif",
                              fontSize: "0.9rem",
                              lineHeight: 1.6,
                              color: "#3D3D3D",
                              paddingLeft: "1.2em",
                              position: "relative",
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: 0,
                                color: "#C41E3A",
                                fontWeight: 700,
                              }}
                            >
                              &middot;
                            </span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Skill tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.4rem",
                        }}
                      >
                        {job.skills.map((s, si) => (
                          <span
                            key={si}
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.65rem",
                              textTransform: "uppercase" as const,
                              letterSpacing: "0.08em",
                              border: "1px solid rgba(0,0,0,0.2)",
                              color: "#6B6560",
                              padding: "0.15rem 0.5rem",
                              background: "transparent",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* MODULE 03 -- PROJECTS / PORTFOLIO                           */}
          {/* ========================================================== */}
          <section
            style={{
              padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <motion.div {...fadeIn}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#C41E3A",
                  color: "#FFFFFF",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  padding: "0.3rem 0.7rem",
                  marginBottom: "0.75rem",
                }}
              >
                03 / Portfolio
              </span>
            </motion.div>

            <motion.h2
              {...fadeUp}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem,5vw,3.5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.1,
                borderBottom: "2px solid #1A1A1A",
                paddingBottom: "0.75rem",
                marginBottom: "2.5rem",
                color: "#1A1A1A",
              }}
            >
              Projets selectionnes
            </motion.h2>

            {/* Project grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 0,
                borderTop: "1px solid rgba(0,0,0,0.12)",
                borderLeft: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              {projects.map((project, i) => {
                const isFeature = i === 0;
                const hasImages =
                  "images" in project &&
                  project.images &&
                  project.images.length > 0;
                return (
                  <motion.div
                    key={i}
                    {...fadeUp}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    style={{
                      gridColumn: isFeature ? "1 / -1" : undefined,
                      backgroundColor: "#FDFCFA",
                      borderRight: "1px solid rgba(0,0,0,0.12)",
                      borderBottom: "1px solid rgba(0,0,0,0.12)",
                      overflow: "hidden",
                      position: "relative",
                      borderLeft: "3px solid transparent",
                      transition:
                        "border-left-color 0.15s ease",
                    }}
                    whileHover={{
                      borderLeftColor: "#C41E3A",
                    }}
                  >
                    {/* Image */}
                    {hasImages && (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: isFeature ? "21 / 9" : "16 / 9",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={project.images![0]}
                          alt={project.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes={
                            isFeature
                              ? "(max-width: 768px) 100vw, 64rem"
                              : "(max-width: 768px) 100vw, 32rem"
                          }
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div style={{ padding: "1.5rem" }}>
                      <h3
                        style={{
                          fontFamily:
                            "'Playfair Display', Georgia, serif",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          fontStyle: "normal",
                          letterSpacing: "-0.02em",
                          color: "#1A1A1A",
                          lineHeight: 1.2,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {project.name}
                      </h3>

                      <p
                        style={{
                          fontFamily:
                            "'Libre Franklin', Helvetica, sans-serif",
                          fontSize: "0.875rem",
                          lineHeight: 1.65,
                          color: "#6B6560",
                          marginBottom: "1rem",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Highlights */}
                      {project.highlights && project.highlights.length > 0 && (
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: "0 0 1rem 0",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.3rem",
                          }}
                        >
                          {project.highlights
                            .slice(0, isFeature ? 4 : 2)
                            .map((h, hi) => (
                              <li
                                key={hi}
                                style={{
                                  fontFamily:
                                    "'Libre Franklin', Helvetica, sans-serif",
                                  fontSize: "0.8rem",
                                  lineHeight: 1.55,
                                  color: "#3D3D3D",
                                  paddingLeft: "1.2em",
                                  position: "relative",
                                }}
                              >
                                <span
                                  style={{
                                    position: "absolute",
                                    left: 0,
                                    color: "#C41E3A",
                                    fontWeight: 700,
                                  }}
                                >
                                  &middot;
                                </span>
                                {h}
                              </li>
                            ))}
                        </ul>
                      )}

                      {/* Links */}
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {project.url && (
                          <Link
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "#6B6560",
                              textDecoration: "none",
                              borderBottom: "1px solid rgba(0,0,0,0.2)",
                            }}
                          >
                            Voir le projet
                          </Link>
                        )}
                        {"github" in project && project.github && (
                          <Link
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: "#6B6560",
                              textDecoration: "none",
                              borderBottom: "1px solid rgba(0,0,0,0.2)",
                            }}
                          >
                            GitHub
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Responsive override for mobile: single column */}
            <style>{`
              @media (max-width: 768px) {
                section div[style*="grid-template-columns: repeat(2"] {
                  grid-template-columns: 1fr !important;
                }
                section div[style*="grid-template-columns: repeat(2"] > div[style*="aspect-ratio: 21 / 9"] {
                  aspect-ratio: 16 / 9 !important;
                }
              }
            `}</style>
          </section>

          {/* ========================================================== */}
          {/* MODULE 04 -- SKILLS / COMPETENCES                           */}
          {/* ========================================================== */}
          <section
            style={{
              padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <motion.div {...fadeIn}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#C41E3A",
                  color: "#FFFFFF",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  fontWeight: 400,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  padding: "0.3rem 0.7rem",
                  marginBottom: "0.75rem",
                }}
              >
                04 / Competences
              </span>
            </motion.div>

            <motion.h2
              {...fadeUp}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem,5vw,3.5rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.1,
                borderBottom: "2px solid #1A1A1A",
                paddingBottom: "0.75rem",
                marginBottom: "2.5rem",
                color: "#1A1A1A",
              }}
            >
              Taxonomie technique
            </motion.h2>

            <motion.div
              {...fadeUp}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
              }}
            >
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  whileHover={{
                    backgroundColor: "#1A1A1A",
                    color: "#F5F2EE",
                    borderColor: "#1A1A1A",
                  }}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    fontWeight: 400,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                    border: "1px solid rgba(0,0,0,0.25)",
                    color: "#3D3D3D",
                    padding: "0.2rem 0.6rem",
                    background: "transparent",
                    cursor: "default",
                    transition:
                      "background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease",
                  }}
                >
                  {skill.name}
                </motion.span>
              ))}
            </motion.div>
          </section>

          {/* ========================================================== */}
          {/* FOOTER -- COLOPHON                                          */}
          {/* ========================================================== */}
          <footer
            style={{
              borderTop: "3px solid #1A1A1A",
              backgroundColor: "#F5F2EE",
              padding: "3rem clamp(1.5rem,4vw,3rem)",
              position: "relative",
            }}
          >
            {/* Colophon label */}
            <motion.div
              {...fadeIn}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase" as const,
                color: "#6B6560",
                marginBottom: "2rem",
              }}
            >
              Colophon
            </motion.div>

            {/* Name -- italic Playfair */}
            <motion.h2
              {...fadeUp}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "1.75rem",
                color: "#1A1A1A",
                borderBottom: "none",
                paddingBottom: 0,
                marginBottom: "0.25rem",
              }}
            >
              {basics.name}
            </motion.h2>

            <motion.p
              {...fadeIn}
              style={{
                fontFamily: "'Libre Franklin', Helvetica, sans-serif",
                fontSize: "0.8rem",
                color: "#6B6560",
                lineHeight: 1.5,
                marginBottom: "1.5rem",
              }}
            >
              {basics.label}
            </motion.p>

            {/* Links */}
            <motion.div
              {...fadeIn}
              transition={{ duration: 0.35, delay: 0.1 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {basics.profiles.map((profile, i) => (
                <Link
                  key={i}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#6B6560",
                    textDecoration: "none",
                    borderBottom: "1px solid transparent",
                    transition: "color 0.12s ease, border-color 0.12s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#1A1A1A";
                    e.currentTarget.style.borderBottomColor = "#1A1A1A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#6B6560";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }}
                >
                  {profile.network}
                </Link>
              ))}
              <Link
                href={`mailto:${basics.email}`}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#6B6560",
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                  transition: "color 0.12s ease, border-color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#1A1A1A";
                  e.currentTarget.style.borderBottomColor = "#1A1A1A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6B6560";
                  e.currentTarget.style.borderBottomColor = "transparent";
                }}
              >
                Email
              </Link>
            </motion.div>

            {/* Copyright bar */}
            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.12)",
                paddingTop: "1.5rem",
                marginTop: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "#6B6560",
                }}
              >
                &copy; {currentYear} {basics.name}. Tous droits reserves.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
