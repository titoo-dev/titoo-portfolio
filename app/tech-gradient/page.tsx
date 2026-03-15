"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  Code2,
  Smartphone,
  Palette,
  Rocket,
  ArrowUpRight,
  Github,
  Heart,
  Mail,
  ExternalLink,
  ImageIcon,
  GitBranch,
  Database,
  Blocks,
  FileCode,
  Layers,
  Box,
  type LucideIcon,
} from "lucide-react";
import cvData from "@/cv.json";

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
  });
};

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const services = [
  {
    icon: Code2,
    title: "Developpement Web",
    description:
      "Applications web modernes et performantes avec React, Next.js et TypeScript. Interfaces intuitives qui convertissent.",
    features: [
      "Applications React / Next.js",
      "Sites web responsives",
      "Progressive Web Apps",
      "Integration API",
    ],
  },
  {
    icon: Smartphone,
    title: "Applications Mobile",
    description:
      "Applications mobiles cross-platform avec Flutter. Experience utilisateur fluide sur iOS et Android.",
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
      "Interfaces elegantes et accessibles avec Figma. Des designs modernes qui captivent vos utilisateurs.",
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
      "Accompagnement technique et formation sur les technologies modernes. Optimisation de vos processus.",
    features: [
      "Audit technique",
      "Formation React / Flutter",
      "Code review",
      "Best practices",
    ],
  },
];

const skillIcons: Record<string, LucideIcon> = {
  Figma: Palette,
  Gitlab: GitBranch,
  HTML: FileCode,
  CSS: Palette,
  JavaScript: Code2,
  Tailwind: Layers,
  TypeScript: Code2,
  Node: Box,
  MySQL: Database,
  Git: GitBranch,
  GitHub: GitBranch,
  "Next.js": Blocks,
  React: Blocks,
};

/* ------------------------------------------------------------------ */
/* COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export default function TechGradientPage() {
  /* Set data-theme on mount, clean up on unmount */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "tech-gradient");
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  const { basics, work, projects, skills } = cvData;

  return (
    <>
      {/* Inline keyframes for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(0,212,255,0.15); }
          50%      { box-shadow: 0 0 20px rgba(0,212,255,0.35), 0 0 40px rgba(123,47,255,0.12); }
        }
        @keyframes neon-border {
          0%, 100% { border-color: rgba(0,212,255,0.18); }
          50%      { border-color: rgba(0,212,255,0.4); }
        }
      `}</style>

      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a0a1e 0%, #0d1b3e 35%, #1a0533 65%, #0f0f1a 100%)",
          backgroundAttachment: "fixed",
          color: "#e0e8ff",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Grid overlay */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.035) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            zIndex: 0,
          }}
        />

        {/* Ambient glow blobs */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute"
            style={{
              top: "-10%",
              left: "30%",
              width: "60vw",
              height: "50vh",
              background:
                "radial-gradient(ellipse at center, rgba(0,212,255,0.07) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "10%",
              right: "10%",
              width: "40vw",
              height: "40vh",
              background:
                "radial-gradient(ellipse at center, rgba(123,47,255,0.05) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "30%",
              left: "5%",
              width: "30vw",
              height: "30vh",
              background:
                "radial-gradient(ellipse at center, rgba(255,45,155,0.03) 0%, transparent 55%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative" style={{ zIndex: 1 }}>
          <div className="max-w-5xl mx-auto px-6 md:px-8">
            {/* ====================================================== */}
            {/* HERO                                                     */}
            {/* ====================================================== */}
            <section className="py-24 md:py-36 flex flex-col items-center text-center gap-8">
              {/* Profile image with neon glow ring */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Glow ring */}
                <div
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,212,255,0.35), rgba(123,47,255,0.35), rgba(255,45,155,0.2))",
                    filter: "blur(8px)",
                    animation: "glow-pulse 3s ease-in-out infinite",
                  }}
                />
                <div
                  className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden"
                  style={{
                    border: "2px solid rgba(0,212,255,0.4)",
                    boxShadow:
                      "0 0 24px rgba(0,212,255,0.15), 0 0 48px rgba(123,47,255,0.08)",
                  }}
                >
                  <Image
                    src={basics.image}
                    alt={basics.name}
                    width={176}
                    height={176}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </motion.div>

              {/* Availability badge */}
              <motion.div
                className="inline-flex items-center gap-2 text-sm"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "#00d4ff",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "#00d4ff" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{
                      background: "#00d4ff",
                      boxShadow: "0 0 6px #00d4ff",
                    }}
                  />
                </span>
                Disponible pour de nouveaux projets
              </motion.div>

              {/* Name - animated gradient */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  background:
                    "linear-gradient(135deg, #00d4ff 0%, #7b2fff 50%, #ff2d9b 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradient-shift 6s ease infinite",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {basics.name}
              </motion.h1>

              {/* Label */}
              <motion.p
                className="text-xl md:text-2xl font-normal"
                style={{
                  color: "#7b8fcc",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {basics.label}
              </motion.p>

              {/* Summary */}
              <motion.p
                className="text-base md:text-lg max-w-2xl leading-relaxed"
                style={{ color: "#8892b0", lineHeight: 1.75 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {basics.summary}
              </motion.p>

              {/* Stats bar */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 md:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                {[
                  { value: "3+", label: "Ans" },
                  { value: `${projects.length}+`, label: "Projets" },
                  { value: `${skills.length}`, label: "Skills" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="px-6 py-3 rounded-xl text-center"
                    style={{
                      background: "rgba(15,15,45,0.55)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(0,212,255,0.12)",
                    }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: "'Space Grotesk', system-ui, sans-serif",
                        color: "#00d4ff",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        color: "#8892b0",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-wrap gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <Link
                  href={`mailto:${basics.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #00d4ff, #7b2fff)",
                    border: "1px solid rgba(0,212,255,0.3)",
                    boxShadow: "0 0 12px rgba(0,212,255,0.15)",
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Me contacter
                </Link>
                <Link
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all"
                  style={{
                    background: "rgba(0,212,255,0.04)",
                    color: "#00d4ff",
                    border: "1px solid rgba(0,212,255,0.2)",
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir mes projets
                </Link>
              </motion.div>

              {/* Profile links */}
              <motion.div
                className="flex flex-wrap gap-6 items-center justify-center pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
              >
                {basics.profiles.map((profile, index) => (
                  <motion.div
                    key={profile.network}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Link
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors group"
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.04em",
                        color: "#8892b0",
                      }}
                    >
                      <span className="font-medium group-hover:text-[#00d4ff] transition-colors">
                        {profile.network}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform group-hover:text-[#00d4ff]" />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* Gradient divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,212,255,0.25) 30%, rgba(123,47,255,0.25) 70%, transparent)",
              }}
            />

            {/* ====================================================== */}
            {/* SERVICES                                                 */}
            {/* ====================================================== */}
            <section className="py-20 relative overflow-hidden">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Section badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.18)",
                    color: "#00d4ff",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00d4ff",
                      boxShadow: "0 0 6px #00d4ff",
                    }}
                  />
                  Services
                </div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-4"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    color: "#e0e8ff",
                  }}
                >
                  Comment puis-je vous aider ?
                </h2>
                <p
                  className="text-lg max-w-2xl mx-auto"
                  style={{ color: "#8892b0" }}
                >
                  Je transforme vos idees en solutions digitales performantes et
                  elegantes
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.title}
                      className="group relative rounded-2xl p-8 overflow-hidden transition-all"
                      style={{
                        background: "rgba(15,15,45,0.45)",
                        border: "1px solid rgba(0,212,255,0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{
                        y: -8,
                        borderColor: "rgba(0,212,255,0.25)",
                        boxShadow:
                          "0 0 30px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.3)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      {/* Hover glow */}
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
                        }}
                      />

                      <div className="flex flex-col gap-4 relative z-10">
                        {/* Icon container */}
                        <motion.div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                          style={{
                            background: "rgba(0,212,255,0.06)",
                            border: "1px solid rgba(0,212,255,0.12)",
                          }}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: "#00d4ff" }}
                          />
                        </motion.div>

                        <div>
                          <h3
                            className="text-xl font-semibold mb-2"
                            style={{
                              fontFamily:
                                "'Space Grotesk', system-ui, sans-serif",
                              color: "#c4d4ff",
                            }}
                          >
                            {service.title}
                          </h3>
                          <p
                            className="leading-relaxed mb-4"
                            style={{ color: "#8892b0" }}
                          >
                            {service.description}
                          </p>
                        </div>

                        <ul className="space-y-2">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-sm"
                              style={{ color: "#8892b0" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{
                                  background: "#00d4ff",
                                  boxShadow:
                                    "0 0 4px rgba(0,212,255,0.5)",
                                }}
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Gradient divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,212,255,0.25) 30%, rgba(123,47,255,0.25) 70%, transparent)",
              }}
            />

            {/* ====================================================== */}
            {/* EXPERIENCE                                               */}
            {/* ====================================================== */}
            <section className="py-20 relative" id="experience">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.18)",
                    color: "#00d4ff",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00d4ff",
                      boxShadow: "0 0 6px #00d4ff",
                    }}
                  />
                  Experience
                </div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-4"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    color: "#e0e8ff",
                  }}
                >
                  Mon parcours professionnel
                </h2>
                <p style={{ color: "#8892b0" }}>
                  Plus de 3 ans d&apos;experience a creer des solutions
                  digitales innovantes
                </p>
              </motion.div>

              <div className="space-y-12">
                {work.map((job, index) => (
                  <motion.div
                    key={job.name}
                    className="group relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  >
                    {/* Timeline line */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px hidden md:block md:left-48"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,212,255,0.3), rgba(123,47,255,0.2), transparent)",
                      }}
                    />
                    {/* Animated timeline fill */}
                    <motion.div
                      className="absolute left-0 top-0 w-px hidden md:block md:left-48 origin-top"
                      style={{
                        background:
                          "linear-gradient(180deg, #00d4ff, rgba(123,47,255,0.4), transparent)",
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.2 + 0.3,
                        duration: 0.8,
                      }}
                    />

                    <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                      {/* Date column */}
                      <div className="flex-shrink-0 md:w-48 text-sm relative">
                        <div className="sticky top-24">
                          <div
                            className="font-medium"
                            style={{
                              color: "#8892b0",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.8rem",
                            }}
                          >
                            {formatDate(job.startDate)} -{" "}
                            {job.endDate
                              ? formatDate(job.endDate)
                              : "Present"}
                          </div>
                          {/* Glowing timeline dot */}
                          <motion.div
                            className="absolute -right-4 top-2 w-2 h-2 rounded-full hidden md:block"
                            style={{
                              background: "#00d4ff",
                              boxShadow:
                                "0 0 8px #00d4ff, 0 0 16px rgba(0,212,255,0.3)",
                            }}
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: index * 0.2 + 0.5,
                              type: "spring",
                              stiffness: 200,
                            }}
                          />
                        </div>
                      </div>

                      {/* Card */}
                      <div
                        className="flex-1 space-y-4 rounded-2xl p-6 transition-all"
                        style={{
                          background: "rgba(15,15,45,0.45)",
                          border: "1px solid rgba(0,212,255,0.08)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <div>
                          <h3
                            className="text-xl font-semibold mb-1"
                            style={{
                              fontFamily:
                                "'Space Grotesk', system-ui, sans-serif",
                              color: "#e0e8ff",
                            }}
                          >
                            {job.position}
                          </h3>
                          {job.url ? (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 transition-colors"
                              style={{ color: "#8892b0" }}
                            >
                              {job.name}
                              <span className="text-xs" style={{ color: "#00d4ff" }}>
                                ↗
                              </span>
                            </a>
                          ) : (
                            <span style={{ color: "#8892b0" }}>
                              {job.name}
                            </span>
                          )}
                          <p
                            className="text-sm mt-1"
                            style={{ color: "#8892b0" }}
                          >
                            {job.location_type} &bull; {job.location}
                          </p>
                        </div>

                        <p
                          className="leading-relaxed"
                          style={{ color: "#8892b0" }}
                        >
                          {job.summary}
                        </p>

                        {job.responsibilities.length > 0 && (
                          <div>
                            <h4
                              className="text-sm font-medium mb-2"
                              style={{ color: "#c4d4ff" }}
                            >
                              Responsabilites
                            </h4>
                            <ul className="space-y-1 text-sm">
                              {job.responsibilities.map((resp) => (
                                <li
                                  key={resp}
                                  className="flex gap-2"
                                  style={{ color: "#8892b0" }}
                                >
                                  <span style={{ color: "#00d4ff" }}>
                                    &bull;
                                  </span>
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Skill tags */}
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 text-xs rounded-full"
                              style={{
                                background: "rgba(123,47,255,0.1)",
                                color: "#c4b5ff",
                                border:
                                  "1px solid rgba(123,47,255,0.18)",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.7rem",
                                letterSpacing: "0.03em",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Gradient divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,212,255,0.25) 30%, rgba(123,47,255,0.25) 70%, transparent)",
              }}
            />

            {/* ====================================================== */}
            {/* PROJECTS                                                 */}
            {/* ====================================================== */}
            <section
              className="py-20 relative overflow-hidden"
              id="projects"
            >
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.18)",
                    color: "#00d4ff",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00d4ff",
                      boxShadow: "0 0 6px #00d4ff",
                    }}
                  />
                  Portfolio
                </div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-4"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    color: "#e0e8ff",
                  }}
                >
                  Projets & Realisations
                </h2>
                <p style={{ color: "#8892b0" }}>
                  Decouvrez quelques-uns de mes projets recents et
                  contributions
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => {
                  const imageList =
                    project.images && project.images.length > 0
                      ? project.images
                      : project.image
                        ? [project.image]
                        : [];

                  return (
                    <motion.div
                      key={project.name}
                      className="group relative rounded-2xl overflow-hidden flex flex-col transition-all"
                      style={{
                        background: "rgba(15,15,45,0.45)",
                        border: "1px solid rgba(0,212,255,0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                      }}
                      whileHover={{
                        borderColor: "rgba(0,212,255,0.25)",
                        boxShadow:
                          "0 0 30px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Top accent bar (gradient cyan -> purple -> pink) */}
                      <div
                        className="absolute top-0 left-0 w-full"
                        style={{
                          height: "2px",
                          background:
                            "linear-gradient(90deg, #00d4ff, #7b2fff, #ff2d9b)",
                          opacity: 0.75,
                          zIndex: 2,
                        }}
                      />

                      {/* Image area */}
                      <div
                        className="relative w-full h-48 overflow-hidden"
                        style={{ background: "rgba(10,10,30,0.6)" }}
                      >
                        {imageList.length === 0 ? (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(15,15,45,0.8), rgba(25,15,50,0.6))",
                            }}
                          >
                            <ImageIcon
                              className="w-16 h-16"
                              style={{
                                color: "rgba(0,212,255,0.15)",
                              }}
                            />
                          </div>
                        ) : (
                          <>
                            <Image
                              src={imageList[0]}
                              alt={project.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {/* Dark overlay on hover */}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background:
                                  "linear-gradient(to top, rgba(10,10,30,0.9), transparent)",
                              }}
                            />
                          </>
                        )}

                        {/* Project action links */}
                        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                          {project.url && (
                            <Link
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full transition-all"
                              style={{
                                background: "rgba(10,10,30,0.8)",
                                border:
                                  "1px solid rgba(0,212,255,0.18)",
                                backdropFilter: "blur(8px)",
                                color: "#00d4ff",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Link>
                          )}
                          {project.github && (
                            <Link
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full transition-all"
                              style={{
                                background: "rgba(10,10,30,0.8)",
                                border:
                                  "1px solid rgba(0,212,255,0.18)",
                                backdropFilter: "blur(8px)",
                                color: "#00d4ff",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-6 flex flex-col gap-3 flex-1">
                        <div>
                          <h3
                            className="text-xl font-semibold mb-2 transition-colors group-hover:text-[#00d4ff]"
                            style={{
                              fontFamily:
                                "'Space Grotesk', system-ui, sans-serif",
                              color: "#e0e8ff",
                            }}
                          >
                            {project.name}
                          </h3>
                          <p
                            className="text-sm leading-relaxed line-clamp-2"
                            style={{ color: "#8892b0" }}
                          >
                            {project.description}
                          </p>
                        </div>

                        {project.highlights.length > 0 && (
                          <ul className="space-y-1.5 text-xs flex-1">
                            {project.highlights
                              .slice(0, 2)
                              .map((highlight) => (
                                <li
                                  key={highlight}
                                  className="flex gap-2"
                                  style={{ color: "#8892b0" }}
                                >
                                  <span
                                    className="mt-0.5"
                                    style={{ color: "#00d4ff" }}
                                  >
                                    &bull;
                                  </span>
                                  <span className="line-clamp-2">
                                    {highlight}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        )}

                        {/* Project links */}
                        <div className="flex gap-4 mt-auto pt-2">
                          {project.url && (
                            <Link
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs transition-colors"
                              style={{
                                color: "#00d4ff",
                                fontFamily: "'DM Mono', monospace",
                              }}
                            >
                              Voir le projet
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          )}
                          {project.github && (
                            <Link
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs transition-colors"
                              style={{
                                color: "#8892b0",
                                fontFamily: "'DM Mono', monospace",
                              }}
                            >
                              Source
                              <Github className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Gradient divider */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,212,255,0.25) 30%, rgba(123,47,255,0.25) 70%, transparent)",
              }}
            />

            {/* ====================================================== */}
            {/* SKILLS                                                   */}
            {/* ====================================================== */}
            <section className="py-20 relative" id="skills">
              <motion.div
                className="mb-12 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
                  style={{
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.18)",
                    color: "#00d4ff",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#00d4ff",
                      boxShadow: "0 0 6px #00d4ff",
                    }}
                  />
                  Competences
                </div>
                <h2
                  className="text-3xl md:text-4xl font-semibold mb-4"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    color: "#e0e8ff",
                  }}
                >
                  Technologies & Outils
                </h2>
                <p style={{ color: "#8892b0" }}>
                  Les technologies que je maitrise pour donner vie a vos
                  projets
                </p>
              </motion.div>

              <div className="flex flex-wrap gap-3 relative z-10">
                {skills.map((skill, index) => {
                  const Icon = skillIcons[skill.name] || Code2;

                  return (
                    <motion.div
                      key={skill.name}
                      className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full transition-all cursor-default"
                      style={{
                        background: "rgba(15,15,45,0.35)",
                        border: "1px solid rgba(0,212,255,0.08)",
                        backdropFilter: "blur(8px)",
                      }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.03,
                        duration: 0.3,
                      }}
                      whileHover={{
                        borderColor: "rgba(0,212,255,0.25)",
                        background: "rgba(0,212,255,0.06)",
                        boxShadow:
                          "0 0 15px rgba(0,212,255,0.08)",
                      }}
                    >
                      {/* Gradient overlay on hover */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0,212,255,0.04), rgba(123,47,255,0.04))",
                        }}
                      />
                      <Icon
                        className="w-4 h-4 relative z-10"
                        style={{ color: "#00d4ff" }}
                      />
                      <span
                        className="font-medium text-sm relative z-10"
                        style={{ color: "#c4d4ff" }}
                      >
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* ====================================================== */}
            {/* FOOTER                                                   */}
            {/* ====================================================== */}
            <footer
              className="py-12 relative"
              style={{
                borderTop: "1px solid rgba(0,212,255,0.08)",
                background: "rgba(8,8,22,0.6)",
              }}
            >
              {/* Gradient accent line on top */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,212,255,0.25), rgba(123,47,255,0.25), transparent)",
                }}
              />

              <div className="flex flex-col gap-8">
                <motion.div
                  className="flex flex-col md:flex-row justify-between items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center md:text-left">
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{
                        fontFamily:
                          "'Space Grotesk', system-ui, sans-serif",
                        color: "#e0e8ff",
                      }}
                    >
                      Travaillons ensemble
                    </h3>
                    <p className="text-sm" style={{ color: "#8892b0" }}>
                      Vous avez un projet en tete ? Discutons-en !
                    </p>
                  </div>

                  <Link
                    href={`mailto:${basics.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, #00d4ff, #7b2fff)",
                      border: "1px solid rgba(0,212,255,0.3)",
                      boxShadow: "0 0 12px rgba(0,212,255,0.15)",
                      fontFamily:
                        "'Space Grotesk', system-ui, sans-serif",
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    Me contacter
                  </Link>
                </motion.div>

                <motion.div
                  className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm pt-8"
                  style={{
                    borderTop: "1px solid rgba(0,212,255,0.08)",
                    color: "#8892b0",
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                    }}
                  >
                    &copy; {new Date().getFullYear()} {basics.name}. Tous
                    droits reserves.
                  </p>
                  <p
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                    }}
                  >
                    Concu avec{" "}
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                      }}
                    >
                      <Heart
                        className="w-4 h-4"
                        style={{
                          color: "#ff2d9b",
                          fill: "#ff2d9b",
                        }}
                      />
                    </motion.span>{" "}
                    a Madagascar
                  </p>
                </motion.div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
