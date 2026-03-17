"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";
import {
  Code2,
  Smartphone,
  Palette,
  Rocket,
  ExternalLink,
  Github,
  Mail,
  Phone,
  Heart,
  Briefcase,
  FolderOpen,
  Wrench,
  ChevronRight,
} from "lucide-react";
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
    icon: Code2,
    title: "Developpement Web",
    description:
      "Applications web modernes et performantes avec React, Next.js et TypeScript.",
    features: [
      "Applications React/Next.js",
      "Sites web responsives",
      "Progressive Web Apps",
      "Integration API",
    ],
  },
  {
    icon: Smartphone,
    title: "Applications Mobile",
    description:
      "Applications mobiles cross-platform avec Flutter. Experience fluide sur iOS et Android.",
    features: [
      "Applications Flutter",
      "UI/UX mobile",
      "Integration Firebase",
      "App Store & Play Store",
    ],
  },
  {
    icon: Palette,
    title: "Design UI/UX",
    description:
      "Interfaces elegantes et accessibles avec Figma. Des designs modernes qui captivent.",
    features: [
      "Prototypage Figma",
      "Design System",
      "Interface responsive",
      "Accessibilite",
    ],
  },
  {
    icon: Rocket,
    title: "Consulting & Formation",
    description:
      "Accompagnement technique et formation de vos equipes sur les technologies modernes.",
    features: [
      "Audit technique",
      "Formation React/Flutter",
      "Code review",
      "Best practices",
    ],
  },
];

const networkIcon: Record<string, string> = {
  LinkedIn: "in",
  GitHub: "GH",
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function BrutalismPage() {
  // Set data-theme on mount, clean up on unmount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "brutalism");
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const { basics, work, projects, skills } = cvData;

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/* Embedded styles for body stripes, watermark, and brutalism extras  */}
      {/* ----------------------------------------------------------------- */}
      <style>{`
        /* Diagonal stripe pattern on body */
        body {
          background-color: #B2BDA0 !important;
          position: relative;
        }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.03) 10px,
            rgba(0,0,0,0.03) 20px
          );
        }
        body::after {
          content: 'PORTFOLIO';
          position: fixed;
          bottom: 3rem;
          right: -3rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 8rem;
          color: rgba(0,0,0,0.04);
          transform: rotate(-90deg);
          transform-origin: bottom right;
          pointer-events: none;
          z-index: 0;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }
        /* Zero border-radius everywhere */
        * { border-radius: 0 !important; }

        /* Selection */
        ::selection {
          background-color: #B2BDA0;
          color: #000;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: #B2BDA0; border-left: 2px solid #000; }
        ::-webkit-scrollbar-thumb { background: #000; border: 2px solid #B2BDA0; }
        ::-webkit-scrollbar-thumb:hover { background: #2C2C2C; }

        @media (max-width: 768px) {
          body::after { display: none; }
        }
      `}</style>

      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{ fontFamily: "'Space Grotesk', sans-serif", zIndex: 1, position: "relative" }}
      >
        {/* Main white content container */}
        <div
          className="max-w-5xl mx-auto px-6 md:px-8"
          style={{
            background: "#F9FAF7",
            border: "4px solid #000000",
            boxShadow: "8px 8px 0px #000000",
            marginTop: "2rem",
            marginBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ============================================================= */}
          {/* HERO SECTION                                                   */}
          {/* ============================================================= */}
          <section
            id="a-propos"
            style={{ borderBottom: "4px solid #000000" }}
            className="py-12 md:py-16"
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile image — SQUARE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex-shrink-0"
              >
                <div
                  style={{
                    width: 160,
                    height: 160,
                    border: "5px solid #000000",
                    boxShadow: "6px 6px 0px #000000",
                    overflow: "hidden",
                    background: "#F9FAF7",
                  }}
                >
                  <Image
                    src={basics.image}
                    alt={basics.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </motion.div>

              <div className="flex-1">
                {/* Available badge — rubber stamp */}
                <motion.span
                  initial={{ scale: 1.2, rotate: -2, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#000000",
                    color: "#B2BDA0",
                    padding: "6px 14px",
                    border: "3px solid #000000",
                    boxShadow: "3px 3px 0px #B2BDA0",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "'Space Grotesk', sans-serif",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: "#B2BDA0",
                      display: "inline-block",
                    }}
                  />
                  Disponible
                </motion.span>

                {/* Name — MASSIVE */}
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(3.5rem, 8vw, 6rem)",
                    lineHeight: 0.95,
                    textTransform: "uppercase",
                    letterSpacing: "0.01em",
                    color: "#000000",
                    marginBottom: "0.5rem",
                  }}
                >
                  {basics.name}
                </motion.h1>

                {/* Label — red left border */}
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    color: "#2C2C2C",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontSize: "1.1rem",
                    borderLeft: "5px solid #2C2C2C",
                    paddingLeft: 12,
                    marginTop: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {basics.label}
                </motion.p>

                {/* Summary — black left border */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1rem",
                    color: "#5A5A5A",
                    lineHeight: 1.7,
                    borderLeft: "3px solid #000000",
                    paddingLeft: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {basics.summary}
                </motion.p>

                {/* Social links — thick underline */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center gap-4"
                >
                  {basics.profiles.map((p) => (
                    <Link
                      key={p.network}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: "3px solid #000000",
                        paddingBottom: 2,
                        fontSize: "0.85rem",
                        textDecoration: "none",
                        transition: "color 0.1s, background 0.1s",
                      }}
                      className="text-black hover:bg-black hover:text-[#B2BDA0] hover:px-1"
                    >
                      {networkIcon[p.network] || p.network} / {p.username}
                    </Link>
                  ))}

                  {/* Email */}
                  <Link
                    href={`mailto:${basics.email}`}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "3px solid #000000",
                      paddingBottom: 2,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                    className="text-black hover:bg-black hover:text-[#B2BDA0] hover:px-1"
                  >
                    <Mail size={14} /> Email
                  </Link>

                  {/* Phone */}
                  <Link
                    href={`tel:${basics.phone}`}
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "3px solid #000000",
                      paddingBottom: 2,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                    className="text-black hover:bg-black hover:text-[#B2BDA0] hover:px-1"
                  >
                    <Phone size={14} /> Tel
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ============================================================= */}
          {/* SERVICES SECTION                                               */}
          {/* ============================================================= */}
          <section id="services" style={{ borderBottom: "4px solid #000000" }} className="py-12">
            {/* Section badge */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#B2BDA0",
                    color: "#000000",
                    border: "3px solid #000000",
                    boxShadow: "3px 3px 0px #000000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "6px 14px",
                  }}
                >
                  <Wrench size={14} /> Services
                </span>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: "#000000",
                    marginTop: "0.5rem",
                    display: "block",
                    position: "relative",
                  }}
                >
                  Comment puis-je vous aider ?
                </h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                const rotation = index % 2 === 0 ? -0.5 : 0.5;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{
                      x: 3,
                      y: 3,
                      boxShadow: "3px 3px 0px #000000",
                    }}
                    style={{
                      background: "#F9FAF7",
                      border: "4px solid #000000",
                      boxShadow: "6px 6px 0px #000000",
                      padding: "2rem",
                      transform: `rotate(${rotation}deg)`,
                      transition: "box-shadow 0.1s ease, transform 0.1s ease",
                      cursor: "default",
                    }}
                  >
                    {/* Icon box */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: "#B2BDA0",
                        border: "3px solid #000000",
                        boxShadow: "2px 2px 0px #000000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <Icon size={24} color="#000000" />
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#000000",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {service.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "#5A5A5A",
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      {service.description}
                    </p>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {service.features.map((f) => (
                        <li
                          key={f}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "0.85rem",
                            color: "#5A5A5A",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              background: "#2C2C2C",
                              flexShrink: 0,
                            }}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ============================================================= */}
          {/* EXPERIENCE SECTION                                             */}
          {/* ============================================================= */}
          <section id="experience" style={{ borderBottom: "4px solid #000000" }} className="py-12">
            {/* Section badge */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#B2BDA0",
                    color: "#000000",
                    border: "3px solid #000000",
                    boxShadow: "3px 3px 0px #000000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "6px 14px",
                  }}
                >
                  <Briefcase size={14} /> Experience
                </span>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: "#000000",
                    marginTop: "0.5rem",
                    display: "block",
                    position: "relative",
                  }}
                >
                  Parcours professionnel
                </h2>
              </div>
            </motion.div>

            {/* Timeline */}
            <div style={{ position: "relative", paddingLeft: 32 }}>
              {/* Bold vertical bar */}
              <div
                style={{
                  position: "absolute",
                  left: 6,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: "#000000",
                }}
              />

              {work.map((job, index) => {
                const rotation = index % 2 === 0 ? -0.3 : 0.3;
                return (
                  <motion.div
                    key={job.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                    style={{
                      position: "relative",
                      marginBottom: "3rem",
                    }}
                  >
                    {/* Red diamond timeline dot */}
                    <div
                      style={{
                        position: "absolute",
                        left: -32,
                        top: 12,
                        width: 16,
                        height: 16,
                        background: "#2C2C2C",
                        border: "3px solid #000000",
                        boxShadow: "2px 2px 0px #000000",
                        transform: "rotate(45deg)",
                      }}
                    />

                    {/* Date label */}
                    <div
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: "#000000",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 8,
                      }}
                    >
                      {formatDate(job.startDate)} — {formatDate(job.endDate)}
                    </div>

                    {/* Card */}
                    <motion.div
                      whileHover={{
                        x: 3,
                        y: 3,
                        boxShadow: "3px 3px 0px #000000",
                      }}
                      style={{
                        background: "#F9FAF7",
                        border: "4px solid #000000",
                        boxShadow: "6px 6px 0px #000000",
                        padding: "1.5rem",
                        transform: `rotate(${rotation}deg)`,
                        transition: "box-shadow 0.1s ease, transform 0.1s ease",
                        position: "relative",
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                        <div>
                          <h3
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "#000000",
                              lineHeight: 1.1,
                            }}
                          >
                            {job.position}
                          </h3>
                          <p
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              color: "#2C2C2C",
                            }}
                          >
                            {job.name}
                            {job.url && (
                              <Link
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginLeft: 6, color: "#2C2C2C" }}
                              >
                                <ExternalLink
                                  size={14}
                                  style={{ display: "inline", verticalAlign: "middle" }}
                                />
                              </Link>
                            )}
                          </p>
                        </div>
                        <span
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#5A5A5A",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {job.location_type} &bull; {job.location}
                        </span>
                      </div>

                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "0.9rem",
                          color: "#5A5A5A",
                          lineHeight: 1.6,
                          marginBottom: "1rem",
                        }}
                      >
                        {job.summary}
                      </p>

                      {/* Responsibilities */}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem 0" }}>
                          {job.responsibilities.map((r) => (
                            <li
                              key={r}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 8,
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: "0.85rem",
                                color: "#5A5A5A",
                                marginBottom: 4,
                              }}
                            >
                              <ChevronRight
                                size={14}
                                style={{
                                  color: "#2C2C2C",
                                  flexShrink: 0,
                                  marginTop: 3,
                                }}
                              />
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Skill tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                background: "#000000",
                                color: "#B2BDA0",
                                border: "2px solid #000000",
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                padding: "4px 10px",
                                display: "inline-block",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* "COMPLETED" stamp for ended positions */}
                      {job.endDate && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "0.7rem",
                            color: "#2C2C2C",
                            border: "2px solid #2C2C2C",
                            padding: "2px 8px",
                            transform: "rotate(6deg)",
                            opacity: 0.5,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            pointerEvents: "none",
                          }}
                        >
                          Termine
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ============================================================= */}
          {/* PROJECTS SECTION                                               */}
          {/* ============================================================= */}
          <section id="projets" style={{ borderBottom: "4px solid #000000" }} className="py-12">
            {/* Section badge */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#B2BDA0",
                    color: "#000000",
                    border: "3px solid #000000",
                    boxShadow: "3px 3px 0px #000000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "6px 14px",
                  }}
                >
                  <FolderOpen size={14} /> Projets
                </span>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: "#000000",
                    marginTop: "0.5rem",
                    display: "block",
                    position: "relative",
                  }}
                >
                  Realisations
                </h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => {
                const hasImages =
                  "images" in project &&
                  project.images &&
                  project.images.length > 0;
                const firstImage = hasImages ? project.images![0] : null;
                const rotation = index % 2 === 0 ? -0.5 : 0.5;

                return (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{
                      x: 3,
                      y: 3,
                      boxShadow: "3px 3px 0px #000000",
                    }}
                    className="group"
                    style={{
                      background: "#F9FAF7",
                      border: "4px solid #000000",
                      boxShadow: "6px 6px 0px #000000",
                      overflow: "hidden",
                      transition: "box-shadow 0.1s ease, transform 0.1s ease",
                      position: "relative",
                      cursor: "default",
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    {/* Red accent bar on top */}
                    <div
                      style={{
                        height: 4,
                        background: "#2C2C2C",
                        width: "100%",
                      }}
                    />

                    {/* Image area */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: 192,
                        background: "#EDEFEA",
                        borderBottom: "3px solid #000000",
                        overflow: "hidden",
                      }}
                    >
                      {firstImage ? (
                        <Image
                          src={firstImage}
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#EDEFEA",
                          }}
                        >
                          <FolderOpen size={48} color="#cccccc" />
                        </div>
                      )}

                      {/* Overlay with links on hover */}
                      <div
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                          padding: 12,
                          gap: 8,
                          transition: "opacity 0.2s",
                        }}
                      >
                        {project.url && (
                          <Link
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: "#B2BDA0",
                              border: "2px solid #000000",
                              boxShadow: "2px 2px 0px #000000",
                              padding: 6,
                              display: "flex",
                              color: "#000000",
                            }}
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                        {"github" in project && project.github && (
                          <Link
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: "#B2BDA0",
                              border: "2px solid #000000",
                              boxShadow: "2px 2px 0px #000000",
                              padding: 6,
                              display: "flex",
                              color: "#000000",
                            }}
                          >
                            <Github size={16} />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "1.25rem" }}>
                      <h3
                        className="group-hover:!text-[#2C2C2C]"
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "#000000",
                          lineHeight: 1.1,
                          marginBottom: "0.5rem",
                          transition: "color 0.15s",
                        }}
                      >
                        {project.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "0.85rem",
                          color: "#5A5A5A",
                          lineHeight: 1.6,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Highlights */}
                      {"highlights" in project &&
                        project.highlights &&
                        project.highlights.length > 0 && (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            {project.highlights.slice(0, 3).map((h) => (
                              <li
                                key={h}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 6,
                                  fontFamily: "'Space Grotesk', sans-serif",
                                  fontSize: "0.8rem",
                                  color: "#5A5A5A",
                                  marginBottom: 4,
                                }}
                              >
                                <ChevronRight
                                  size={12}
                                  style={{
                                    color: "#2C2C2C",
                                    flexShrink: 0,
                                    marginTop: 3,
                                  }}
                                />
                                <span style={{ lineHeight: 1.4 }}>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ============================================================= */}
          {/* SKILLS SECTION                                                 */}
          {/* ============================================================= */}
          <section id="competences" style={{ borderBottom: "4px solid #000000" }} className="py-12">
            {/* Section badge */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "stretch" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: "#B2BDA0",
                    color: "#000000",
                    border: "3px solid #000000",
                    boxShadow: "3px 3px 0px #000000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "6px 14px",
                  }}
                >
                  <Wrench size={14} /> Competences
                </span>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    color: "#000000",
                    marginTop: "0.5rem",
                    display: "block",
                    position: "relative",
                  }}
                >
                  Technologies & Outils
                </h2>
              </div>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{
                    x: 2,
                    y: 2,
                    boxShadow: "1px 1px 0px #000000",
                    backgroundColor: "#000000",
                    color: "#B2BDA0",
                  }}
                  style={{
                    background: "#B2BDA0",
                    border: "3px solid #000000",
                    boxShadow: "3px 3px 0px #000000",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "10px 18px",
                    cursor: "default",
                    transition: "box-shadow 0.1s ease, transform 0.1s ease, background-color 0.1s ease, color 0.1s ease",
                    color: "#000000",
                  }}
                >
                  {skill.name}
                </motion.div>
              ))}
            </div>
          </section>

          {/* ============================================================= */}
          {/* FOOTER                                                         */}
          {/* ============================================================= */}
          <footer
            style={{
              background: "#B2BDA0",
              borderTop: "4px solid #000000",
              padding: "2rem 1.5rem",
            }}
          >
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center md:text-left">
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2rem",
                    textTransform: "uppercase",
                    color: "#000000",
                    marginBottom: "0.25rem",
                  }}
                >
                  Travaillons ensemble
                </h3>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "#000000",
                    fontWeight: 500,
                  }}
                >
                  Vous avez un projet en tete ? Discutons-en !
                </p>
              </div>

              <motion.a
                href={`mailto:${basics.email}`}
                whileHover={{ x: 2, y: 2, boxShadow: "2px 2px 0px #000000" }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#000000",
                  color: "#B2BDA0",
                  border: "3px solid #000000",
                  boxShadow: "4px 4px 0px #000000",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "12px 24px",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "box-shadow 0.1s ease, transform 0.1s ease",
                }}
              >
                <Mail size={16} /> Contactez-moi
              </motion.a>
            </motion.div>

            <div
              style={{
                borderTop: "3px solid #000000",
                paddingTop: "1.5rem",
              }}
              className="flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                &copy; {new Date().getFullYear()} {basics.name}. Tous droits
                reserves.
              </p>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                Concu avec{" "}
                <Heart
                  size={16}
                  fill="#2C2C2C"
                  color="#2C2C2C"
                />{" "}
                a Madagascar
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
