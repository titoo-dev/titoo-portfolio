"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect } from "react";
import cvData from "@/cv.json";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
  });
};

/* -------------------------------------------------------------------------- */
/*  Static Data                                                                */
/* -------------------------------------------------------------------------- */

const services = [
  {
    title: "Developpement Web",
    description:
      "Creation d'applications web modernes et performantes avec React, Next.js et TypeScript.",
    features: [
      "Applications React / Next.js",
      "Sites web responsives",
      "Progressive Web Apps",
      "Integration API",
    ],
  },
  {
    title: "Applications Mobile",
    description:
      "Developpement d'applications mobiles cross-platform avec Flutter pour iOS et Android.",
    features: [
      "Applications Flutter",
      "UI/UX mobile",
      "Integration Firebase",
      "App Store & Play Store",
    ],
  },
  {
    title: "Design UI/UX",
    description:
      "Conception d'interfaces elegantes et accessibles avec Figma.",
    features: [
      "Prototypage Figma",
      "Design System",
      "Interface responsive",
      "Accessibilite",
    ],
  },
  {
    title: "Consulting & Formation",
    description:
      "Accompagnement technique et formation sur les technologies modernes.",
    features: [
      "Audit technique",
      "Formation React / Flutter",
      "Code review",
      "Best practices",
    ],
  },
];

/* Compute some numbers for the hero stats row */
const totalSkills = cvData.skills.length;
const totalProjects = cvData.projects.length;

/* Rarity helper for skill tags inside experience cards */
const skillRarity = (index: number) => {
  if (index === 0) return "legendary";
  if (index % 3 === 1) return "rare";
  if (index % 3 === 2) return "epic";
  return "common";
};

const rarityStyle: Record<string, string> = {
  legendary:
    "bg-[rgba(255,215,0,0.1)] text-[#FFD700] border-[rgba(255,215,0,0.35)] shadow-[0_0_8px_rgba(255,215,0,0.2)]",
  epic: "bg-[rgba(155,89,182,0.12)] text-[#c47cff] border-[rgba(155,89,182,0.4)] shadow-[0_0_8px_rgba(155,89,182,0.2)]",
  rare: "bg-[rgba(0,191,255,0.1)] text-[#00BFFF] border-[rgba(0,191,255,0.35)] shadow-[0_0_8px_rgba(0,191,255,0.15)]",
  common:
    "bg-[rgba(33,38,45,0.9)] text-[#8b949e] border-[rgba(139,148,158,0.25)]",
};

/* -------------------------------------------------------------------------- */
/*  Page Component                                                             */
/* -------------------------------------------------------------------------- */

export default function GamificationPage() {
  /* Set data-theme on mount, clean up on unmount */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "gamification");
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Inline keyframe animations                                          */}
      {/* ------------------------------------------------------------------ */}
      <style>{`
        @keyframes game-pulse {
          0%, 100% { box-shadow: 0 0 5px #00ff88, 0 0 10px #00ff88; }
          50%      { box-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88; }
        }
        @keyframes game-grid-move {
          0%   { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        @keyframes game-scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes game-profile-ring {
          0%   { box-shadow: 0 0 0 3px rgba(0,255,136,.6), 0 0 20px rgba(0,255,136,.3); }
          50%  { box-shadow: 0 0 0 5px rgba(0,255,136,.9), 0 0 35px rgba(0,255,136,.5), 0 0 60px rgba(0,255,136,.2); }
          100% { box-shadow: 0 0 0 3px rgba(0,255,136,.6), 0 0 20px rgba(0,255,136,.3); }
        }
        @keyframes game-border-glow {
          0%, 100% { border-color: rgba(0,255,136,.3); box-shadow: 0 0 8px rgba(0,255,136,.1); }
          50%      { border-color: rgba(0,255,136,.7); box-shadow: 0 0 16px rgba(0,255,136,.3); }
        }
        @keyframes game-flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: .85; }
          97% { opacity: 1; }
          98% { opacity: .9; }
        }
        @keyframes game-hp-bar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes game-xp-fill {
          0%   { width: 0; }
          100% { width: 75%; }
        }
        @keyframes game-level-glow {
          0%, 100% { text-shadow: 0 0 8px #FFD700, 0 0 16px #FFD700; }
          50%      { text-shadow: 0 0 12px #FFD700, 0 0 24px #FFD700, 0 0 40px #FFD700; }
        }
        @keyframes game-stamp-in {
          0%   { opacity: 0; transform: scale(2) rotate(-20deg); }
          60%  { opacity: .8; transform: scale(.9) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(-5deg); }
        }

        /* Wrapper grid */
        .game-wrapper {
          background-color: #0d1117;
          background-image:
            linear-gradient(rgba(0,255,136,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: game-grid-move 20s linear infinite, game-flicker 8s infinite;
          min-height: 100vh;
          position: relative;
          color: #e6edf3;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 500;
        }

        /* Scanlines overlay */
        .game-scanlines {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,.08) 2px,
            rgba(0,0,0,.08) 4px
          );
          pointer-events: none;
          z-index: 50;
          animation: game-scanline .1s linear infinite;
        }

        /* HUD corner brackets */
        .hud-corner-tl {
          position: fixed; top: 1rem; left: 1rem;
          width: 2rem; height: 2rem;
          border-top: 2px solid rgba(0,255,136,.5);
          border-left: 2px solid rgba(0,255,136,.5);
          pointer-events: none; z-index: 100;
        }
        .hud-corner-br {
          position: fixed; bottom: 1rem; right: 1rem;
          width: 2rem; height: 2rem;
          border-bottom: 2px solid rgba(0,255,136,.5);
          border-right: 2px solid rgba(0,255,136,.5);
          pointer-events: none; z-index: 100;
        }

        /* Section badge arrow clip */
        .game-badge {
          background: #00ff88;
          color: #0d1117;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
          font-family: 'Orbitron', monospace;
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .15em;
          text-transform: uppercase;
          padding: .4rem 1.25rem .4rem .85rem;
          display: inline-block;
          box-shadow: 4px 0 12px rgba(0,255,136,.3);
          border-radius: 0;
        }

        /* Profile octagon */
        .game-profile-octagon {
          clip-path: polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%);
          animation: game-profile-ring 2.5s ease-in-out infinite;
          border: 3px solid #00ff88;
        }

        /* XP bar */
        .game-xp-bar-track {
          background: rgba(0,255,136,.08);
          border: 1px solid rgba(0,255,136,.3);
          border-radius: 2px;
          overflow: hidden;
          height: .6rem;
          width: 10rem;
        }
        .game-xp-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00ff88, #00BFFF);
          box-shadow: 0 0 8px rgba(0,255,136,.4);
          animation: game-xp-fill 2s ease-out forwards;
        }

        /* Card base */
        .game-card {
          background: linear-gradient(135deg, #161b22 0%, #1c2128 100%);
          border: 1px solid rgba(0,255,136,.2);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          transition: border-color .3s ease, box-shadow .3s ease;
        }
        .game-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, #00ff88, transparent 60%);
          opacity: .6;
        }

        /* Animated border glow on cards */
        .game-card-glow {
          animation: game-border-glow 3s ease-in-out infinite;
        }

        /* COMPLETED stamp */
        .game-stamp-completed {
          position: absolute; top: .75rem; right: .75rem;
          font-family: 'Orbitron', monospace;
          font-size: .55rem; font-weight: 700;
          letter-spacing: .15em; color: #00ff88;
          background: rgba(0,255,136,.08);
          border: 1px solid rgba(0,255,136,.3);
          padding: .2rem .5rem; border-radius: 2px;
          animation: game-stamp-in .5s ease-out forwards;
          z-index: 2;
        }

        /* QUEST COMPLETE stamp */
        .game-stamp-quest {
          position: absolute; top: .6rem; right: .6rem;
          font-family: 'Orbitron', monospace;
          font-size: .5rem; font-weight: 700;
          letter-spacing: .1em; color: #FFD700;
          background: rgba(255,215,0,.08);
          border: 1px solid rgba(255,215,0,.25);
          padding: .2rem .5rem; border-radius: 2px;
          opacity: .85;
          animation: game-stamp-in .6s ease-out forwards;
          z-index: 2;
        }

        /* Stat HUD mini-card */
        .game-stat-card {
          background: rgba(0,255,136,.05);
          border: 1px solid rgba(0,255,136,.2);
          border-radius: 2px;
          padding: .5rem 1rem;
          text-align: center;
          font-family: 'Orbitron', monospace;
        }
        .game-stat-card .stat-value {
          font-size: 1.1rem; font-weight: 700; color: #00ff88;
          text-shadow: 0 0 6px rgba(0,255,136,.4);
        }
        .game-stat-card .stat-label {
          font-size: .55rem; letter-spacing: .15em; color: #8b949e;
          text-transform: uppercase;
        }

        /* Timeline line */
        .game-timeline-line {
          border-left: 2px solid #00ff88;
          box-shadow: 2px 0 8px rgba(0,255,136,.3);
        }

        /* Timeline diamond marker */
        .game-diamond {
          width: .5rem; height: .5rem;
          background: #00ff88;
          transform: rotate(45deg);
          box-shadow: 0 0 8px #00ff88, 0 0 16px rgba(0,255,136,.4);
          animation: game-pulse 2s ease-in-out infinite;
        }

        /* Skill tag in stat tree */
        .game-skill-tag {
          background: linear-gradient(90deg, rgba(0,255,136,.15), rgba(0,255,136,.05));
          border: 1px solid rgba(0,255,136,.3);
          border-radius: 2px;
          color: #00ff88;
          font-family: 'Orbitron', monospace;
          font-size: .62rem; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          padding: .25rem .75rem;
          display: inline-flex; align-items: center; gap: .3rem;
          transition: all .25s ease; cursor: default;
        }
        .game-skill-tag:hover {
          background: linear-gradient(90deg, rgba(0,255,136,.25), rgba(0,255,136,.1));
          border-color: rgba(0,255,136,.6);
          box-shadow: 0 0 12px rgba(0,255,136,.25), inset 0 0 8px rgba(0,255,136,.05);
          transform: translateY(-2px);
          color: #e6edf3;
        }

        /* Rarity skill tag (experience cards) */
        .game-rarity-tag {
          font-family: 'Orbitron', monospace;
          font-size: .6rem; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          border-radius: 2px;
          padding: .2rem .6rem;
          border-width: 1px; border-style: solid;
          transition: all .2s ease;
        }
        .game-rarity-tag:hover {
          filter: brightness(1.3);
          transform: translateY(-1px);
        }

        /* Project card gold border */
        .game-project-card {
          background: linear-gradient(135deg, #161b22, #1c2128);
          border: 1px solid rgba(255,215,0,.2);
          border-left: 3px solid #FFD700;
          border-radius: 2px;
          position: relative; overflow: hidden;
          transition: all .3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,.4), -4px 0 16px rgba(255,215,0,.06);
        }
        .game-project-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #FFD700, rgba(255,215,0,.3), transparent);
          opacity: .7; z-index: 1;
        }
        .game-project-card:hover {
          border-color: rgba(255,215,0,.5);
          box-shadow:
            0 0 0 1px rgba(255,215,0,.15),
            0 8px 32px rgba(0,0,0,.5),
            -6px 0 24px rgba(255,215,0,.12),
            0 0 50px rgba(255,215,0,.06);
          transform: translateY(-2px);
        }

        /* Footer rainbow HP bar */
        .game-footer-hp {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #00ff88 25%, #FFD700 50%, #00BFFF 75%, transparent 100%);
          box-shadow: 0 0 12px rgba(0,255,136,.4);
          animation: game-hp-bar 3s ease-in-out infinite alternate;
        }

        /* Level badge inline */
        .game-level-badge {
          font-family: 'Orbitron', monospace;
          font-size: .7rem; font-weight: 700;
          color: #FFD700;
          background: rgba(255,215,0,.1);
          border: 1px solid rgba(255,215,0,.4);
          padding: .15rem .5rem; border-radius: 2px;
          letter-spacing: .12em;
          animation: game-level-glow 2s ease-in-out infinite;
          text-shadow: 0 0 8px #FFD700;
          display: inline-block; vertical-align: middle;
          margin-left: .75rem;
        }

        /* Heading styles */
        .game-h2 {
          font-family: 'Orbitron', monospace;
          color: #FFD700;
          text-shadow: 0 0 8px rgba(255,215,0,.4);
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        /* Neon green heading */
        .game-h3 {
          font-family: 'Orbitron', monospace;
          color: #00ff88;
          text-transform: uppercase;
          letter-spacing: .1em;
          font-size: .9rem;
        }
      `}</style>

      {/* ------------------------------------------------------------------ */}
      {/* Fixed overlays                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="game-scanlines" />
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* ------------------------------------------------------------------ */}
      {/* Main wrapper                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="game-wrapper">
        <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-[1]">
          {/* ================================================================ */}
          {/* 1. HERO  CHARACTER PROFILE                                       */}
          {/* ================================================================ */}
          <section className="py-20 md:py-32">
            <motion.div
              className="flex flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Profile image  octagonal */}
              <div className="relative">
                <div
                  className="game-profile-octagon relative w-32 h-32 overflow-hidden"
                  style={{ borderRadius: 0 }}
                >
                  <Image
                    src={cvData.basics.image}
                    alt={cvData.basics.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)",
                      filter: "saturate(1.2) contrast(1.1)",
                    }}
                    priority
                  />
                </div>

                {/* XP bar below profile */}
                <div className="game-xp-bar-track mt-3 mx-auto">
                  <div className="game-xp-bar-fill" />
                </div>
                <p
                  className="mt-1 text-center"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: ".5rem",
                    letterSpacing: ".1em",
                    color: "#8b949e",
                  }}
                >
                  7 500 / 10 000 XP
                </p>
              </div>

              {/* Name + Level badge */}
              <motion.h1
                className="text-3xl md:text-5xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "#e6edf3",
                  textShadow: "0 0 30px rgba(0,255,136,.15)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {cvData.basics.name}
                <span className="game-level-badge">[LVL 10]</span>
              </motion.h1>

              {/* CLASS label */}
              <motion.p
                className="text-sm md:text-base"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 600,
                  color: "#00ff88",
                  textTransform: "uppercase",
                  letterSpacing: ".15em",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: ".75rem",
                    fontWeight: 700,
                    color: "#FFD700",
                    letterSpacing: ".1em",
                    marginRight: ".25rem",
                  }}
                >
                  CLASS:
                </span>
                {cvData.basics.label}
              </motion.p>

              {/* ONLINE status */}
              <motion.div
                className="inline-flex items-center gap-2"
                style={{
                  background: "rgba(0,255,136,.08)",
                  border: "1px solid rgba(0,255,136,.4)",
                  borderRadius: 2,
                  padding: ".35rem .85rem",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: ".65rem",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#00ff88",
                  boxShadow:
                    "0 0 12px rgba(0,255,136,.1), inset 0 0 8px rgba(0,255,136,.05)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{
                      background: "#00ff88",
                      animation: "game-pulse 1.5s ease-in-out infinite",
                    }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{
                      background: "#00ff88",
                      boxShadow: "0 0 6px #00ff88, 0 0 12px rgba(0,255,136,.4)",
                    }}
                  />
                </span>
                ONLINE &mdash; Disponible pour de nouveaux projets
              </motion.div>

              {/* Summary */}
              <motion.p
                className="max-w-2xl leading-relaxed"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: ".95rem",
                  color: "#8b949e",
                  lineHeight: 1.7,
                  borderLeft: "2px solid rgba(0,255,136,.3)",
                  paddingLeft: "1rem",
                  textAlign: "left",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {cvData.basics.summary}
              </motion.p>

              {/* Stats row */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="game-stat-card">
                  <div className="stat-value">3+</div>
                  <div className="stat-label">Ans XP</div>
                </div>
                <div className="game-stat-card">
                  <div className="stat-value">{totalProjects}+</div>
                  <div className="stat-label">Quests</div>
                </div>
                <div className="game-stat-card">
                  <div className="stat-value">{totalSkills}</div>
                  <div className="stat-label">Abilities</div>
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div
                className="flex gap-6 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {cvData.basics.profiles.map((profile) => (
                  <Link
                    key={profile.network}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm transition-colors"
                    style={{
                      color: "#00ff88",
                      fontFamily: "'Orbitron', monospace",
                      fontSize: ".65rem",
                      letterSpacing: ".08em",
                    }}
                  >
                    {profile.network}
                    <span style={{ fontSize: ".6rem" }}>&nearr;</span>
                  </Link>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* ================================================================ */}
          {/* 2. SERVICES  ABILITIES                                           */}
          {/* ================================================================ */}
          <section className="py-20" style={{ borderTop: "1px solid rgba(0,255,136,.2)" }}>
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="game-badge mb-4">Abilities</div>
              <h2 className="game-h2 text-2xl md:text-3xl font-bold mb-3">
                Arbre de competences
              </h2>
              <p style={{ color: "#8b949e", fontFamily: "'Rajdhani', sans-serif" }}>
                Les capacites acquises au fil des quetes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="game-card game-card-glow p-6"
                  style={{ borderLeft: "3px solid #00ff88" }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      color: "#FFD700",
                      textShadow: "0 0 8px rgba(255,215,0,.3)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      fontSize: ".85rem",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      color: "#8b949e",
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: ".9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {service.description}
                  </p>
                  <ul className="space-y-1.5">
                    {service.features.map((feature, idx) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                        style={{
                          color: "#8b949e",
                          fontFamily: "'Rajdhani', sans-serif",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: "#00ff88" }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================================================================ */}
          {/* 3. EXPERIENCE  QUEST LOG                                         */}
          {/* ================================================================ */}
          <section
            className="py-20"
            id="experience"
            style={{ borderTop: "1px solid rgba(0,255,136,.2)" }}
          >
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="game-badge mb-4">Quest Log</div>
              <h2 className="game-h2 text-2xl md:text-3xl font-bold mb-3">
                Journal de quetes
              </h2>
              <p style={{ color: "#8b949e", fontFamily: "'Rajdhani', sans-serif" }}>
                Plus de 3 ans d&apos;experience a creer des solutions digitales
              </p>
            </motion.div>

            <div className="space-y-10">
              {cvData.work.map((work, index) => (
                <motion.div
                  key={work.name}
                  className="relative flex gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  {/* Timeline */}
                  <div className="hidden md:flex flex-col items-center gap-0 pt-2">
                    <div className="game-diamond flex-shrink-0" />
                    {index < cvData.work.length - 1 && (
                      <div
                        className="flex-1 w-0.5"
                        style={{
                          background: "#00ff88",
                          boxShadow: "0 0 8px rgba(0,255,136,.3)",
                          minHeight: "100%",
                        }}
                      />
                    )}
                  </div>

                  {/* Card */}
                  <div className="flex-1">
                    <div
                      className="game-card game-card-glow p-6 relative"
                      style={{ borderLeft: "3px solid #00ff88" }}
                    >
                      {/* COMPLETED stamp */}
                      {work.endDate && (
                        <div className="game-stamp-completed">
                          &#10003; COMPLETED
                        </div>
                      )}

                      {/* Date range */}
                      <p
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: ".75rem",
                          color: "#8b949e",
                          letterSpacing: ".05em",
                          marginBottom: ".5rem",
                        }}
                      >
                        {formatDate(work.startDate)} &mdash;{" "}
                        {work.endDate ? formatDate(work.endDate) : "En cours"}
                      </p>

                      {/* Position */}
                      <h3
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          color: "#FFD700",
                          textShadow: "0 0 8px rgba(255,215,0,.3)",
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                          fontSize: ".85rem",
                          fontWeight: 700,
                          marginBottom: ".25rem",
                        }}
                      >
                        {work.position}
                      </h3>

                      {/* Company */}
                      {work.url ? (
                        <a
                          href={work.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1"
                          style={{
                            color: "#00ff88",
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: ".9rem",
                          }}
                        >
                          {work.name}{" "}
                          <span style={{ fontSize: ".6rem" }}>&nearr;</span>
                        </a>
                      ) : (
                        <span
                          style={{
                            color: "#8b949e",
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: ".9rem",
                          }}
                        >
                          {work.name}
                        </span>
                      )}
                      <p
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: ".8rem",
                          color: "#8b949e",
                          marginTop: ".15rem",
                        }}
                      >
                        {work.location_type} &bull; {work.location}
                      </p>

                      {/* Summary */}
                      <p
                        className="mt-3"
                        style={{
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: ".9rem",
                          color: "#8b949e",
                          lineHeight: 1.6,
                        }}
                      >
                        {work.summary}
                      </p>

                      {/* Responsibilities */}
                      {work.responsibilities.length > 0 && (
                        <div className="mt-3">
                          <h4
                            style={{
                              fontFamily: "'Orbitron', monospace",
                              color: "#00ff88",
                              textTransform: "uppercase",
                              letterSpacing: ".12em",
                              fontSize: ".7rem",
                              fontWeight: 700,
                              marginBottom: ".5rem",
                            }}
                          >
                            Objectifs de quete
                          </h4>
                          <ul className="space-y-1">
                            {work.responsibilities.map((resp, idx) => (
                              <li
                                key={resp}
                                className="flex gap-2 text-sm"
                                style={{
                                  color: "#8b949e",
                                  fontFamily: "'Rajdhani', sans-serif",
                                }}
                              >
                                <span style={{ color: "#00ff88" }}>&bull;</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skill tags with rarity */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {work.skills.map((skill, idx) => {
                          const rarity = skillRarity(idx);
                          return (
                            <span
                              key={skill}
                              className={`game-rarity-tag ${rarityStyle[rarity]}`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================================================================ */}
          {/* 4. PROJECTS  QUEST BOARD                                         */}
          {/* ================================================================ */}
          <section
            className="py-20"
            id="projects"
            style={{ borderTop: "1px solid rgba(0,255,136,.2)" }}
          >
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="game-badge mb-4">Quest Board</div>
              <h2 className="game-h2 text-2xl md:text-3xl font-bold mb-3">
                Tableau de quetes
              </h2>
              <p style={{ color: "#8b949e", fontFamily: "'Rajdhani', sans-serif" }}>
                Missions accomplies et butins recoltes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cvData.projects.map((project, index) => {
                const imageList =
                  project.images && project.images.length > 0
                    ? project.images
                    : [];
                const firstImage = imageList[0] ?? null;

                return (
                  <motion.div
                    key={project.name}
                    className="game-project-card flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {/* QUEST COMPLETE stamp */}
                    <div className="game-stamp-quest">
                      &#9733; QUEST COMPLETE
                    </div>

                    {/* Image */}
                    {firstImage && (
                      <div className="relative w-full h-44 overflow-hidden">
                        <Image
                          src={firstImage}
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, #161b22 0%, rgba(22,27,34,.4) 50%, transparent 100%)",
                          }}
                        />
                      </div>
                    )}

                    <div className="p-6 flex flex-col gap-3 flex-1">
                      {/* Project name */}
                      <h3
                        style={{
                          fontFamily: "'Orbitron', monospace",
                          color: "#FFD700",
                          textShadow: "0 0 10px rgba(255,215,0,.25)",
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                          fontSize: ".85rem",
                          fontWeight: 700,
                        }}
                      >
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm leading-relaxed line-clamp-3"
                        style={{
                          color: "#8b949e",
                          fontFamily: "'Rajdhani', sans-serif",
                          fontSize: ".875rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Highlights */}
                      {project.highlights.length > 0 && (
                        <ul className="space-y-1 flex-1">
                          {project.highlights.slice(0, 2).map((h, idx) => (
                            <li
                              key={h}
                              className="flex gap-2 text-xs"
                              style={{
                                color: "#8b949e",
                                fontFamily: "'Rajdhani', sans-serif",
                              }}
                            >
                              <span style={{ color: "#FFD700", marginTop: 2 }}>
                                &bull;
                              </span>
                              <span className="line-clamp-2">{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Action links */}
                      <div className="flex gap-3 mt-2">
                        {project.url && (
                          <Link
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'Orbitron', monospace",
                              fontSize: ".65rem",
                              letterSpacing: ".1em",
                              color: "#00ff88",
                              border: "1px solid rgba(0,255,136,.3)",
                              padding: ".3rem .7rem",
                              borderRadius: 2,
                              textTransform: "uppercase",
                              transition: "color .2s ease, border-color .2s ease",
                            }}
                          >
                            Demo &nearr;
                          </Link>
                        )}
                        {project.github && (
                          <Link
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'Orbitron', monospace",
                              fontSize: ".65rem",
                              letterSpacing: ".1em",
                              color: "#00ff88",
                              border: "1px solid rgba(0,255,136,.3)",
                              padding: ".3rem .7rem",
                              borderRadius: 2,
                              textTransform: "uppercase",
                              transition: "color .2s ease, border-color .2s ease",
                            }}
                          >
                            GitHub &nearr;
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ================================================================ */}
          {/* 5. SKILLS  STAT TREE                                             */}
          {/* ================================================================ */}
          <section
            className="py-20"
            id="skills"
            style={{ borderTop: "1px solid rgba(0,255,136,.2)" }}
          >
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="game-badge mb-4">Stat Tree</div>
              <h2 className="game-h2 text-2xl md:text-3xl font-bold mb-3">
                Arbre de stats
              </h2>
              <p style={{ color: "#8b949e", fontFamily: "'Rajdhani', sans-serif" }}>
                Technologies et outils maitrises
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-3">
              {cvData.skills.map((skill, index) => (
                <motion.span
                  key={skill.name}
                  className="game-skill-tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                >
                  <span style={{ fontSize: ".45rem", opacity: 0.7 }}>
                    &#9650;
                  </span>
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </section>

          {/* ================================================================ */}
          {/* 6. FOOTER  CREDITS                                               */}
          {/* ================================================================ */}
          <footer
            className="py-12 relative overflow-hidden"
            style={{
              background: "#0a0e14",
              borderTop: "1px solid rgba(0,255,136,.2)",
            }}
          >
            {/* Rainbow HP bar */}
            <div className="game-footer-hp absolute top-0 left-0 right-0" />

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
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      color: "#00ff88",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      fontSize: ".85rem",
                      fontWeight: 700,
                      marginBottom: ".5rem",
                    }}
                  >
                    Travaillons ensemble
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: ".85rem",
                      color: "#8b949e",
                    }}
                  >
                    Vous avez un projet en tete ? Discutons-en !
                  </p>
                </div>

                <Link
                  href={`mailto:${cvData.basics.email}`}
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: ".7rem",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#0d1117",
                    background: "#00ff88",
                    padding: ".5rem 1.25rem",
                    borderRadius: 2,
                    boxShadow: "0 0 12px rgba(0,255,136,.3)",
                    transition: "background .2s ease, box-shadow .2s ease",
                  }}
                >
                  Contacter
                </Link>
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
                style={{ borderTop: "1px solid rgba(0,255,136,.15)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <p
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: ".65rem",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#8b949e",
                  }}
                >
                  &copy; {new Date().getFullYear()} {cvData.basics.name}. Tous
                  droits reserves.
                </p>

                <div className="flex gap-4">
                  {cvData.basics.profiles.map((profile) => (
                    <Link
                      key={profile.network}
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#00ff88",
                        fontFamily: "'Orbitron', monospace",
                        fontSize: ".65rem",
                        letterSpacing: ".08em",
                        transition: "color .2s ease, filter .2s ease",
                        filter: "drop-shadow(0 0 4px rgba(0,255,136,.3))",
                      }}
                    >
                      {profile.network}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
