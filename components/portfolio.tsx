"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  careers,
  experience,
  interests,
  PROFILE,
  projects,
  services,
  stackA,
  stackB,
} from "@/lib/portfolio-data";
import { CareerModal } from "./portfolio/career-modal";
import { ExpandIcon, LinkedInIcon, MailIcon } from "./portfolio/icons";
import { MadagascarMap } from "./portfolio/madagascar-map";
import { MusicCarousel } from "./portfolio/music-carousel";
import { ProjectModal } from "./portfolio/project-modal";

const MONO = "var(--font-mono),monospace";
const SANS = "var(--font-sans),sans-serif";

// repeated "mono caption" label atop each bento card
const cardLabel: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 13,
  color: "#9a978d",
};

export function Portfolio() {
  const [svc, setSvc] = useState(0);
  const [projHead, setProjHead] = useState(0);
  const [projFade, setProjFade] = useState(false);
  const [musicHead, setMusicHead] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);
  const [modalFade, setModalFade] = useState(false);
  const [parcoursOpen, setParcoursOpen] = useState(false);
  const [careerIdx, setCareerIdx] = useState(0);
  const [careerFade, setCareerFade] = useState(false);

  // latest values, so interval/keyboard handlers stay fresh without re-binding
  const ref = useRef({
    projHead,
    projFade,
    modalOpen,
    modalIdx,
    modalFade,
    parcoursOpen,
    careerIdx,
    careerFade,
  });
  ref.current = {
    projHead,
    projFade,
    modalOpen,
    modalIdx,
    modalFade,
    parcoursOpen,
    careerIdx,
    careerFade,
  };

  const fadeT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mFadeT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cFadeT = useRef<ReturnType<typeof setTimeout>>(undefined);

  const changeProj = useCallback((i: number) => {
    if (i === ref.current.projHead || ref.current.projFade) return;
    setProjFade(true);
    clearTimeout(fadeT.current);
    fadeT.current = setTimeout(() => {
      setProjHead(i);
      setProjFade(false);
    }, 280);
  }, []);

  const setProj = useCallback((i: number) => {
    if (i === ref.current.modalIdx || ref.current.modalFade) return;
    setModalFade(true);
    clearTimeout(mFadeT.current);
    mFadeT.current = setTimeout(() => {
      setModalIdx(i);
      setModalFade(false);
    }, 220);
  }, []);

  const projStep = useCallback(
    (dir: number) =>
      setProj((ref.current.modalIdx + dir + projects.length) % projects.length),
    [setProj],
  );

  const setCareer = useCallback((i: number) => {
    if (i === ref.current.careerIdx || ref.current.careerFade) return;
    setCareerFade(true);
    clearTimeout(cFadeT.current);
    cFadeT.current = setTimeout(() => {
      setCareerIdx(i);
      setCareerFade(false);
    }, 220);
  }, []);

  const careerStep = useCallback(
    (dir: number) =>
      setCareer(
        (ref.current.careerIdx + dir + careers.length) % careers.length,
      ),
    [setCareer],
  );

  const openModal = useCallback(() => {
    setModalIdx(ref.current.projHead);
    setModalFade(false);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);
  const openParcours = useCallback(() => {
    setCareerIdx(0);
    setParcoursOpen(true);
  }, []);
  const closeParcours = useCallback(() => setParcoursOpen(false), []);

  // autoplay the project showcase; pause while a modal is open
  useEffect(() => {
    if (modalOpen || parcoursOpen) return;
    const t = setInterval(() => {
      changeProj((ref.current.projHead + 1) % projects.length);
    }, 6500);
    return () => clearInterval(t);
  }, [modalOpen, parcoursOpen, changeProj]);

  // keyboard: Esc closes, arrows navigate the open modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = ref.current;
      if (e.key === "Escape") {
        if (s.modalOpen) closeModal();
        if (s.parcoursOpen) closeParcours();
      } else if (s.modalOpen) {
        if (e.key === "ArrowRight") projStep(1);
        else if (e.key === "ArrowLeft") projStep(-1);
      } else if (s.parcoursOpen) {
        if (e.key === "ArrowRight") careerStep(1);
        else if (e.key === "ArrowLeft") careerStep(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal, closeParcours, projStep, careerStep]);

  // lock background scroll while a modal is open
  useEffect(() => {
    if (!modalOpen && !parcoursOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen, parcoursOpen]);

  const cp = projects[projHead];
  const previewOpacity = projFade ? 0 : 1;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--paper)",
        display: "flex",
        justifyContent: "center",
      }}
      className="px-3 md:px-[46px]"
    >
      {/* floating window */}
      <div
        className="anim-win w-full max-w-[1240px]"
        style={{
          flex: "none",
          overflow: "hidden",
          background: "#f4f3f0",
        }}
      >
        {/* page */}
        <div
          className="px-5 pt-8 pb-10 md:px-[76px] md:pt-[46px] md:pb-[60px]"
          style={{
            background:
              "radial-gradient(120% 90% at 80% 0%,#faf9f6 0%,#f1f0ec 55%,#eceae5 100%)",
          }}
        >
          {/* ============================== HEADER ============================== */}
          <div
            className="anim-up mb-9 flex items-center justify-between md:mb-[54px]"
            style={{ "--d": "0.14s" } as React.CSSProperties}
          >
            <div className="flex items-center gap-3 md:gap-[14px]">
              <div
                className="size-11 rounded-[14px] md:size-12 md:rounded-[15px]"
                style={{
                  position: "relative",
                  background: "linear-gradient(150deg,#333 0%,#141414 70%)",
                  boxShadow:
                    "0 7px 20px rgba(0,0,0,.24),inset 0 1px 1px rgba(255,255,255,.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                }}
              >
                <span
                  className="text-[23px] md:text-[25px]"
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    color: "#fff",
                    lineHeight: 1,
                    letterSpacing: "-.04em",
                  }}
                >
                  T
                </span>
                <span
                  style={{
                    position: "absolute",
                    right: 7,
                    bottom: 7,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 0 3px rgba(242,97,26,.2)",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  className="text-[15px] md:text-[16px]"
                  style={{
                    fontFamily: SANS,
                    fontWeight: 700,
                    color: "#1c1c1c",
                    letterSpacing: "-.01em",
                    lineHeight: 1,
                  }}
                >
                  {PROFILE.name}
                </span>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="email-link"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                    fontFamily: MONO,
                    fontSize: 12.5,
                    color: "#9a978d",
                    lineHeight: 1,
                    width: "max-content",
                  }}
                >
                  <MailIcon />
                  {PROFILE.email}
                </a>
              </div>
            </div>

            {/* desktop pills */}
            <div className="hidden items-center gap-[10px] md:flex">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-link"
                style={socialPill}
              >
                {/* biome-ignore lint/performance/noImgElement: external brand logo (simpleicons CDN) */}
                <img
                  src="https://cdn.simpleicons.org/github/1c1c1c"
                  alt=""
                  width={15}
                  height={15}
                  style={{ display: "block" }}
                />
                GitHub ↗
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-link"
                style={socialPill}
              >
                <LinkedInIcon />
                LinkedIn ↗
              </a>
            </div>
            {/* mobile icon buttons */}
            <div className="flex items-center gap-2 md:hidden">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="pill-link"
                style={iconSquare}
              >
                {/* biome-ignore lint/performance/noImgElement: external brand logo (simpleicons CDN) */}
                <img
                  src="https://cdn.simpleicons.org/github/1c1c1c"
                  alt=""
                  width={17}
                  height={17}
                  style={{ display: "block" }}
                />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="pill-link"
                style={iconSquare}
              >
                <LinkedInIcon size={17} />
              </a>
            </div>
          </div>

          {/* =============================== HERO =============================== */}
          <div className="mb-[26px] md:mb-10">
            <h1
              className="anim-up flex flex-wrap items-center gap-[14px] md:gap-[22px]"
              style={{ "--d": "0.24s", margin: 0 } as React.CSSProperties}
            >
              <span className="text-[42px] md:text-[60px]" style={heroWord}>
                Hi, I&apos;m
              </span>
              {/* biome-ignore lint/performance/noImgElement: hero portrait with object-position fine-tuning */}
              <img
                src={PROFILE.photo}
                alt={PROFILE.name}
                className="h-[54px] w-[64px] rounded-[16px] md:h-[74px] md:w-[90px] md:rounded-[20px]"
                style={{
                  objectFit: "cover",
                  objectPosition: "center 22%",
                  boxShadow: "0 8px 24px rgba(0,0,0,.16)",
                  border: "3px solid rgba(255,255,255,.95)",
                  outline: "1px solid rgba(255,255,255,.5)",
                  transformOrigin: "bottom center",
                  animation: "wave 1.5s ease-in-out 1.85s both",
                }}
              />
              <span className="text-[42px] md:text-[60px]" style={heroWord}>
                Titosy.
              </span>
            </h1>

            {/* desktop: two lines */}
            <div
              className="anim-up mt-[10px] hidden md:block"
              style={{ "--d": "0.34s" } as React.CSSProperties}
            >
              <div
                className="text-[60px]"
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  letterSpacing: "-.025em",
                  lineHeight: 1.08,
                }}
              >
                <span style={{ color: "#bdbab1" }}>I build </span>
                <span style={{ color: "#1c1c1c" }}>web &amp; mobile</span>
                <span style={{ color: "#bdbab1" }}> with</span>
              </div>
            </div>
            <div
              className="anim-up mt-2 hidden flex-wrap items-center gap-6 md:flex"
              style={{ "--d": "0.44s" } as React.CSSProperties}
            >
              <span
                className="text-[60px]"
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  letterSpacing: "-.025em",
                  color: "var(--accent)",
                  lineHeight: 1,
                }}
              >
                JavaScript &amp; Flutter.
              </span>
              <span style={statusPill}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#2bcc63",
                    boxShadow: "0 0 0 4px rgba(43,204,99,.18)",
                  }}
                />
                Disponible
              </span>
            </div>

            {/* mobile: combined */}
            <div
              className="anim-up mt-2 text-[42px] md:hidden"
              style={
                {
                  "--d": "0.34s",
                  fontFamily: SANS,
                  fontWeight: 800,
                  letterSpacing: "-.025em",
                  lineHeight: 1.06,
                } as React.CSSProperties
              }
            >
              <span style={{ color: "#bdbab1" }}>I build </span>
              <span style={{ color: "#1c1c1c" }}>web &amp; mobile</span>
              <span style={{ color: "#bdbab1" }}> with </span>
              <span style={{ color: "var(--accent)" }}>
                JavaScript &amp; Flutter.
              </span>
            </div>
            <div
              className="anim-up mt-4 md:hidden"
              style={{ "--d": "0.44s" } as React.CSSProperties}
            >
              <span
                style={{ ...statusPill, fontSize: 15, padding: "10px 17px" }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#2bcc63",
                    boxShadow: "0 0 0 4px rgba(43,204,99,.18)",
                  }}
                />
                Disponible
              </span>
            </div>
          </div>

          {/* =============================== CTA =============================== */}
          <p
            className="anim-up mb-[30px] max-w-[470px] text-[16px] md:mb-[46px] md:text-[18px]"
            style={
              {
                "--d": "0.54s",
                lineHeight: 1.45,
                color: "#3f3d38",
                fontWeight: 400,
                margin: "0 0 30px",
              } as React.CSSProperties
            }
          >
            Plus qu&apos;un développeur, un partenaire technique impliqué dans
            la réussite de votre produit&nbsp; 4+ ans à transformer des idées en
            produits concrets.
          </p>

          {/* =============================== BENTO ============================== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-[18px]">
            {/* Experience */}
            <button
              type="button"
              onClick={openParcours}
              title="Voir mon parcours"
              className="anim-up glass glass-hover glass-lift order-2 cursor-pointer rounded-[24px] p-6 text-left md:order-none"
              style={{ "--d": "0.64s" } as React.CSSProperties}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 22,
                }}
              >
                <span style={cardLabel}>Mon parcours</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: MONO,
                    fontSize: 11,
                    color: "var(--accent)",
                  }}
                >
                  Détails
                  <ExpandIcon />
                </span>
              </div>
              <div
                className="h-[188px] md:h-[226px]"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  WebkitMaskImage:
                    "linear-gradient(to bottom,transparent 0,#000 13%,#000 80%,transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom,transparent 0,#000 13%,#000 80%,transparent 100%)",
                }}
              >
                <div
                  className="marquee-pause"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    animation: "marqueeUp 13s linear 1.95s infinite",
                  }}
                >
                  {[...experience, ...experience].map((job, i) => (
                    <div
                      key={`${job.company}-${i}`}
                      style={{ display: "flex", gap: 14 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          alignSelf: "stretch",
                        }}
                      >
                        <span
                          style={{
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            background: "#1c1c1c",
                            marginTop: 3,
                          }}
                        />
                        <span
                          style={{
                            flex: 1,
                            width: 2,
                            background: "#dcdad2",
                            marginTop: 4,
                          }}
                        />
                      </div>
                      <div style={{ paddingBottom: 18 }}>
                        <div
                          style={{
                            fontSize: 15.5,
                            fontWeight: 600,
                            color: "#1c1c1c",
                          }}
                        >
                          {job.role}
                        </div>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "var(--accent)",
                            marginTop: 2,
                          }}
                        >
                          {job.company}
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: "#8c897f",
                            marginTop: 3,
                          }}
                        >
                          {job.meta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </button>

            {/* Projects showcase */}
            <div
              className="anim-up glass glass-hover order-1 flex flex-col rounded-[24px] p-6 md:order-none md:col-span-2"
              style={{ "--d": "0.72s" } as React.CSSProperties}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div style={cardLabel}>Projets sélectionnés</div>
                <div style={{ display: "flex", gap: 7 }}>
                  {projects.map((p, i) => (
                    <button
                      type="button"
                      key={p.name}
                      aria-label={p.name}
                      onClick={() => changeProj(i)}
                      style={{
                        width: i === projHead ? 22 : 8,
                        height: 8,
                        borderRadius: 5,
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all .3s ease",
                        background:
                          i === projHead ? "var(--accent)" : "#cfccc2",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-4 md:flex-row md:gap-[22px]">
                <button
                  type="button"
                  onClick={openModal}
                  title="Voir l'étude de cas"
                  className="case-cover w-full cursor-pointer md:w-[340px] md:flex-none"
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "3px solid #fff",
                    boxShadow: "0 12px 30px rgba(0,0,0,.16)",
                    background: "#e9e7e0",
                    aspectRatio: "16/10",
                    position: "relative",
                    padding: 0,
                    opacity: previewOpacity,
                  }}
                >
                  {/* biome-ignore lint/performance/noImgElement: dynamic showcase image */}
                  <img
                    src={cp.img}
                    alt={cp.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    className="case-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 13,
                      background:
                        "linear-gradient(to top,rgba(20,20,20,.55) 0%,transparent 46%)",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        background: "rgba(255,255,255,.95)",
                        backdropFilter: "blur(6px)",
                        borderRadius: 24,
                        padding: "8px 15px",
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#1c1c1c",
                        boxShadow: "0 4px 14px rgba(0,0,0,.22)",
                      }}
                    >
                      <ExpandIcon size={14} />
                      Étude de cas
                    </span>
                  </div>
                </button>
                <div className="flex flex-col pt-1">
                  <div
                    style={{
                      opacity: previewOpacity,
                      transition: "opacity .28s ease",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span
                        style={{
                          fontSize: 25,
                          fontWeight: 800,
                          color: "#1c1c1c",
                          letterSpacing: "-.02em",
                        }}
                      >
                        {cp.name}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: MONO,
                        fontSize: 12,
                        color: "var(--accent)",
                        marginTop: 7,
                      }}
                    >
                      {cp.tag}
                    </div>
                    <div
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.5,
                        color: "#54514a",
                        marginTop: 12,
                        maxWidth: 330,
                      }}
                    >
                      {cp.desc}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: "auto",
                      paddingTop: 16,
                    }}
                  >
                    {projects.map((p, i) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => changeProj(i)}
                        title={p.name}
                        style={{
                          flex: "none",
                          width: 52,
                          height: 38,
                          borderRadius: 9,
                          overflow: "hidden",
                          padding: 0,
                          cursor: "pointer",
                          background: "#e9e7e0",
                          transition: "all .2s ease",
                          border:
                            i === projHead
                              ? "2px solid var(--accent)"
                              : "2px solid transparent",
                          boxShadow:
                            i === projHead
                              ? "0 4px 12px rgba(0,0,0,.18)"
                              : "0 1px 4px rgba(0,0,0,.08)",
                          opacity: i === projHead ? 1 : 0.62,
                        }}
                      >
                        {/* biome-ignore lint/performance/noImgElement: dynamic project thumbnail */}
                        <img
                          src={p.thumb}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div
              className="anim-up glass glass-hover glass-lift order-3 rounded-[24px] md:order-none"
              style={
                {
                  "--d": "0.80s",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 248,
                } as React.CSSProperties
              }
            >
              <svg
                viewBox="0 0 320 280"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.28,
                }}
              >
                <g stroke="#bdbab0" strokeWidth={1} fill="none">
                  <path d="M-20 70 L340 70" />
                  <path d="M-20 140 L340 140" />
                  <path d="M-20 210 L340 210" />
                  <path d="M70 -20 L70 300" />
                  <path d="M150 -20 L150 300" />
                  <path d="M230 -20 L230 300" />
                </g>
              </svg>
              <MadagascarMap className="map-island" />
              <div
                style={{
                  position: "absolute",
                  left: "53%",
                  top: "50%",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 16,
                    height: 16,
                    margin: "-8px 0 0 -8px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    animation: "ping 2.6s ease-out 2.3s infinite",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 16,
                    height: 16,
                    margin: "-8px 0 0 -8px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    animation: "ping 2.6s ease-out 3.6s infinite",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 15,
                    height: 15,
                    margin: "-7.5px 0 0 -7.5px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    border: "2.5px solid #fff",
                    boxShadow: "0 2px 7px rgba(0,0,0,.32)",
                    animation: "pindrop .6s cubic-bezier(.2,.8,.2,1) 2s both",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  background: "#fff",
                  borderRadius: 11,
                  padding: "6px 15px",
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "#6b6860",
                  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                  zIndex: 2,
                }}
              >
                Basé à
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 26,
                  textAlign: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    letterSpacing: ".18em",
                    fontSize: 24,
                    color: "#2b2b2b",
                  }}
                >
                  {PROFILE.location.city}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    letterSpacing: ".32em",
                    fontSize: 11,
                    color: "#7d7a72",
                    marginTop: 6,
                  }}
                >
                  {PROFILE.location.country}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    letterSpacing: ".1em",
                    fontSize: 10,
                    color: "#a8a59b",
                    marginTop: 7,
                  }}
                >
                  {PROFILE.location.coords}
                </div>
              </div>
            </div>

            {/* Tech stack marquee */}
            <div
              className="anim-up glass glass-hover order-4 flex flex-col justify-center rounded-[24px] py-6 md:order-none md:col-span-2"
              style={
                { "--d": "0.88s", overflow: "hidden" } as React.CSSProperties
              }
            >
              <div style={{ ...cardLabel, margin: "0 24px 20px" }}>
                Stack &amp; outils
              </div>
              <div
                style={{
                  position: "relative",
                  WebkitMaskImage:
                    "linear-gradient(to right,transparent,#000 6%,#000 94%,transparent)",
                  maskImage:
                    "linear-gradient(to right,transparent,#000 6%,#000 94%,transparent)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 11,
                    width: "max-content",
                    animation: "mqLeft 26s linear infinite",
                  }}
                >
                  {[...stackA, ...stackA].map((s, i) => (
                    <StackPill key={`a-${s.name}-${i}`} {...s} />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 11,
                    width: "max-content",
                    animation: "mqRight 26s linear infinite",
                  }}
                >
                  {[...stackB, ...stackB].map((s, i) => (
                    <StackPill key={`b-${s.name}-${i}`} {...s} />
                  ))}
                </div>
              </div>
            </div>

            {/* Music playlist */}
            <div
              className="anim-up glass glass-hover glass-lift order-5 flex flex-col rounded-[24px] p-6 md:order-none"
              style={
                { "--d": "0.94s", overflow: "hidden" } as React.CSSProperties
              }
            >
              <div style={{ ...cardLabel, marginBottom: 18 }}>Ma playlist</div>
              <MusicCarousel
                head={musicHead}
                onAdvance={(d) => setMusicHead((h) => (h + d) % 5)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 7,
                  marginTop: "auto",
                }}
              >
                <div
                  style={{ fontSize: 19, fontWeight: 700, color: "#1c1c1c" }}
                >
                  Titosy&apos;s Playlist
                </div>
                <a
                  href={PROFILE.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "7px solid #fff",
                        borderTop: "4.5px solid transparent",
                        borderBottom: "4.5px solid transparent",
                        marginLeft: 2,
                      }}
                    />
                  </span>
                  <span
                    style={{ fontSize: 14, color: "#6b6860", fontWeight: 500 }}
                  >
                    Play on Spotify
                  </span>
                </a>
              </div>
            </div>

            {/* Services */}
            <div
              className="anim-up glass glass-hover order-6 flex flex-col rounded-[24px] p-6 md:order-none md:col-span-2 md:p-[26px_28px]"
              style={{ "--d": "0.96s" } as React.CSSProperties}
            >
              <div style={{ ...cardLabel, marginBottom: 18 }}>
                Ce que je fais
              </div>
              <div
                className="text-[22px] md:text-[24px]"
                style={{ fontWeight: 700, color: "#1c1c1c", marginBottom: 12 }}
              >
                {services[svc].title}
              </div>
              <div
                className="text-[15px] md:text-[15.5px]"
                style={{
                  lineHeight: 1.55,
                  color: "#54514a",
                  marginBottom: 16,
                  maxWidth: 540,
                  minHeight: 48,
                }}
              >
                {services[svc].body}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: "auto",
                  minHeight: 36,
                }}
              >
                {services[svc].features.map((f) => (
                  <span
                    key={f}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      fontSize: 13,
                      color: "#54514a",
                      background: "#fff",
                      border: "1px solid #ecebe5",
                      borderRadius: 20,
                      padding: "6px 13px",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent)",
                      }}
                    />
                    {f}
                  </span>
                ))}
              </div>
              <div
                className="mt-[22px] max-w-full overflow-x-auto"
                style={{
                  display: "flex",
                  gap: 4,
                  background: "#fff",
                  borderRadius: 34,
                  padding: 6,
                  width: "max-content",
                  maxWidth: "100%",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,.05)",
                }}
              >
                {services.map((s, i) => (
                  <button
                    type="button"
                    key={s.label}
                    onClick={() => setSvc(i)}
                    style={{
                      fontSize: 14,
                      padding: "11px 20px",
                      borderRadius: 28,
                      fontFamily: SANS,
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all .15s ease",
                      ...(i === svc
                        ? {
                            background: "#1c1c1c",
                            color: "#fff",
                            fontWeight: 600,
                            boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                          }
                        : {
                            background: "transparent",
                            color: "#8c897f",
                            fontWeight: 500,
                          }),
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Now / interests */}
            <div
              className="anim-up glass glass-hover order-7 flex flex-col gap-6 rounded-[24px] p-6 md:order-none md:col-span-3 md:flex-row md:items-stretch md:gap-10 md:p-[26px_28px]"
              style={{ "--d": "1.04s" } as React.CSSProperties}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ ...cardLabel, marginBottom: 14 }}>
                  En ce moment
                </div>
                <div
                  className="text-[18px] md:text-[19px]"
                  style={{
                    fontWeight: 700,
                    color: "#1c1c1c",
                    lineHeight: 1.35,
                  }}
                >
                  {PROFILE.now.title}{" "}
                  <span style={{ color: "var(--accent)" }}>
                    {PROFILE.now.company}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#8c897f",
                    marginTop: 7,
                    lineHeight: 1.5,
                    maxWidth: 420,
                  }}
                >
                  {PROFILE.now.desc}
                </div>
              </div>
              <div
                className="hidden md:block"
                style={{ width: 1, background: "#e4e2db", flex: "none" }}
              />
              <div
                className="md:hidden"
                style={{ height: 1, background: "#e4e2db" }}
              />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: "#a8a59b",
                    marginBottom: 12,
                  }}
                >
                  CENTRES D&apos;INTÉRÊT
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {interests.map((i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 14,
                        color: "#54514a",
                        background: "#fff",
                        border: "1px solid #ecebe5",
                        borderRadius: 20,
                        padding: "7px 14px",
                      }}
                    >
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProjectModal
          projects={projects}
          index={modalIdx}
          fade={modalFade}
          onClose={closeModal}
          onPrev={() => projStep(-1)}
          onNext={() => projStep(1)}
          onSelect={setProj}
        />
      )}
      {parcoursOpen && (
        <CareerModal
          careers={careers}
          index={careerIdx}
          fade={careerFade}
          onClose={closeParcours}
          onPrev={() => careerStep(-1)}
          onNext={() => careerStep(1)}
          onSelect={setCareer}
        />
      )}
    </main>
  );
}

function StackPill({ name, logo }: { name: string; logo: string }) {
  return (
    <span
      style={{
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        fontFamily: MONO,
        fontSize: 14,
        fontWeight: 700,
        color: "#3f3d38",
        background: "#fff",
        border: "1px solid #ecebe5",
        borderRadius: 11,
        padding: "9px 15px",
        boxShadow: "0 2px 6px rgba(0,0,0,.04)",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: external brand logo (simpleicons CDN) */}
      <img
        src={logo}
        alt=""
        width={16}
        height={16}
        style={{
          display: "block",
          width: 16,
          height: 16,
          objectFit: "contain",
          flex: "none",
        }}
      />
      {name}
    </span>
  );
}

const socialPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
  color: "#6b6860",
  border: "1px solid #e2e0d8",
  background: "#fff",
  borderRadius: 9,
  padding: "8px 13px",
  fontFamily: MONO,
  fontSize: 13,
};

const iconSquare: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  textDecoration: "none",
  border: "1px solid #e2e0d8",
  background: "#fff",
  borderRadius: 11,
  color: "#6b6860",
};

const heroWord: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 800,
  letterSpacing: "-.025em",
  color: "#1c1c1c",
  lineHeight: 1,
};

const statusPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  background: "#fff",
  borderRadius: 30,
  padding: "11px 19px",
  fontSize: 17,
  fontWeight: 500,
  color: "#54514a",
  boxShadow: "0 4px 16px rgba(0,0,0,.06),inset 0 1px 1px rgba(255,255,255,.9)",
};
