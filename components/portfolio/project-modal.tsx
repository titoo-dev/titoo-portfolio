"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/portfolio-data";
import {
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExternalCircleIcon,
} from "./icons";

const COVER_IMG: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};
const MONO = "var(--font-mono),monospace";
const SANS = "var(--font-sans),sans-serif";

export function ProjectModal({
  projects,
  index,
  fade,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  projects: Project[];
  index: number;
  fade: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  const dScroll = useRef<HTMLDivElement>(null);
  const mScroll = useRef<HTMLDivElement>(null);
  const mp = projects[index];
  const op = fade ? 0 : 1;

  // reset scroll to top whenever the active project changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: index is the intended trigger
  useEffect(() => {
    if (dScroll.current) dScroll.current.scrollTop = 0;
    if (mScroll.current) mScroll.current.scrollTop = 0;
  }, [index]);

  const projIndex = String(index + 1).padStart(2, "0");
  const projTotal = String(projects.length).padStart(2, "0");
  const tags = mp.tech.slice(0, 4);
  const highlights = mp.highlights.map((text, i) => ({
    n: String(i + 1).padStart(2, "0"),
    text,
  }));
  const gallery = mp.gallery.slice(1, 4);

  const scrollDetails = () => {
    const el = dScroll.current;
    if (el) el.scrollTo({ top: el.clientHeight, behavior: "smooth" });
  };

  const tagEls = tags.map((t) => (
    <span
      key={t}
      style={{
        fontFamily: MONO,
        fontSize: 11,
        color: "#54514a",
        border: "1px solid rgba(0,0,0,.16)",
        borderRadius: 7,
        padding: "6px 12px",
      }}
    >
      {t}
    </span>
  ));

  const actionButtons = (
    <>
      {mp.url && (
        <a
          href={mp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-dark"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            background: "#1c1c1c",
            border: "1px solid #1c1c1c",
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 15,
            padding: "11px 13px 11px 20px",
            borderRadius: 30,
          }}
        >
          View Project
          <ExternalCircleIcon size={22} />
        </a>
      )}
      {mp.github && (
        <a
          href={mp.github}
          target="_blank"
          rel="noopener noreferrer"
          className="outline-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            background: "transparent",
            border: "1px solid rgba(0,0,0,.18)",
            color: "#3f3d38",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 15,
            padding: "11px 19px",
            borderRadius: 30,
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: external brand logo (simpleicons CDN) */}
          <img
            src="https://cdn.simpleicons.org/github/3f3d38"
            alt=""
            width={16}
            height={16}
            style={{ display: "block", opacity: 0.85 }}
          />
          Code
        </a>
      )}
    </>
  );

  const statCards = mp.stats.map((s) => (
    <div
      key={s.v}
      style={{
        flex: 1,
        background: "#fff",
        border: "1px solid rgba(0,0,0,.08)",
        borderRadius: 16,
        padding: "18px 16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 24,
          color: "#1c1c1c",
          letterSpacing: "-.02em",
        }}
      >
        {s.k}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: "#9a978d",
          marginTop: 6,
        }}
      >
        {s.v}
      </div>
    </div>
  ));

  const highlightEls = highlights.map((h) => (
    <div
      key={h.n}
      style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
    >
      <span
        style={{
          flex: "none",
          width: 26,
          height: 26,
          borderRadius: 8,
          background: "var(--accent,#f2611a)",
          color: "#fff",
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        {h.n}
      </span>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#54514a" }}>
        {h.text}
      </div>
    </div>
  ));

  const techEls = mp.tech.map((t) => (
    <span
      key={t}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: MONO,
        fontSize: 13,
        fontWeight: 700,
        color: "#3f3d38",
        background: "#fff",
        border: "1px solid rgba(0,0,0,.1)",
        borderRadius: 11,
        padding: "8px 14px",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--accent,#f2611a)",
        }}
      />
      {t}
    </span>
  ));

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-dismiss; Escape also closes
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape key handler lives in the parent
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(30,28,24,.42)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
      }}
    >
      {/* ============================= DESKTOP ============================= */}
      <div
        className="hidden md:block"
        style={{
          position: "relative",
          width: "min(1340px,96vw)",
          height: "min(770px,92vh)",
          background: "#f4f1ea",
          border: "1px solid rgba(0,0,0,.08)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 50px 130px rgba(0,0,0,.32)",
          animation: "modalPop .45s cubic-bezier(.16,.84,.36,1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 18,
            boxShadow:
              "inset 0 0 0 2px rgba(255,255,255,.9),inset 0 3px 6px rgba(255,255,255,1)",
            pointerEvents: "none",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: op,
            transition: "opacity .4s ease",
          }}
        >
          {/* biome-ignore lint/performance/noImgElement: dynamic project hero image */}
          <img src={mp.gallery[0]} alt={mp.name} style={COVER_IMG} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(101deg,rgba(244,241,234,.97) 0%,rgba(244,241,234,.9) 23%,rgba(244,241,234,.52) 50%,rgba(244,241,234,.08) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top,rgba(244,241,234,.95) 0%,rgba(244,241,234,.3) 30%,transparent 52%)",
          }}
        />
        <button
          type="button"
          onClick={onClose}
          title="Fermer (Esc)"
          aria-label="Fermer"
          className="modal-close"
          style={closeBtnStyle}
        >
          <CloseIcon />
        </button>

        <div
          ref={dScroll}
          className="sc-scroll-dark"
          style={{
            position: "absolute",
            inset: 0,
            overflowY: "auto",
            zIndex: 4,
          }}
        >
          {/* COVER */}
          <div
            style={{
              position: "relative",
              minHeight: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "60px 56px 150px",
            }}
          >
            <div
              style={{
                maxWidth: 560,
                opacity: op,
                transition: "opacity .4s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 24,
                }}
              >
                {tagEls}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: ".24em",
                  color: "#9a978d",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {mp.type}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 62,
                  lineHeight: 0.95,
                  letterSpacing: "-.015em",
                  color: "#1c1c1c",
                  textTransform: "uppercase",
                }}
              >
                {mp.name}
              </div>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "#54514a",
                  marginTop: 22,
                  maxWidth: 450,
                }}
              >
                {mp.overview}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 30,
                  flexWrap: "wrap",
                }}
              >
                {actionButtons}
              </div>
              <button
                type="button"
                onClick={scrollDetails}
                className="ghost-btn"
                style={critereBtnStyle}
              >
                <ArrowDownIcon
                  style={{
                    display: "block",
                    animation: "nudge 1.6s ease-in-out infinite",
                  }}
                />
                Voir les critères
              </button>
            </div>

            {/* thumbnails (other projects) */}
            <div
              style={{
                position: "absolute",
                right: 40,
                bottom: 38,
                zIndex: 6,
                display: "flex",
                gap: 14,
                alignItems: "flex-end",
              }}
            >
              {projects.map((p, i) => {
                const on = i === index;
                return (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => onSelect(i)}
                    title={p.name}
                    style={{
                      position: "relative",
                      flex: "none",
                      width: 128,
                      height: 96,
                      borderRadius: 13,
                      overflow: "hidden",
                      padding: 0,
                      cursor: "pointer",
                      background: "#16161a",
                      transition: "all .22s ease",
                      border: on
                        ? "2px solid var(--accent,#f2611a)"
                        : "2px solid rgba(255,255,255,.14)",
                      boxShadow: on
                        ? "0 14px 32px rgba(0,0,0,.5)"
                        : "0 6px 16px rgba(0,0,0,.3)",
                      transform: on ? "translateY(-8px)" : "translateY(0)",
                      opacity: on ? 1 : 0.7,
                    }}
                  >
                    {/* biome-ignore lint/performance/noImgElement: dynamic project thumbnail */}
                    <img src={p.gallery[0]} alt="" style={COVER_IMG} />
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top,rgba(0,0,0,.78) 0%,transparent 52%)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: 11,
                        right: 11,
                        bottom: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 9,
                          letterSpacing: ".14em",
                          color: "rgba(255,255,255,.65)",
                          textTransform: "uppercase",
                        }}
                      >
                        {p.type.split(" ")[0]}
                      </span>
                      <span
                        style={{
                          fontFamily: SANS,
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#fff",
                          lineHeight: 1.1,
                        }}
                      >
                        {p.name}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* arrows */}
            <div
              style={{
                position: "absolute",
                left: 56,
                bottom: 42,
                zIndex: 6,
                display: "flex",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={onPrev}
                title="Précédent"
                aria-label="Précédent"
                className="circle-btn"
                style={arrowBtnStyle}
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={onNext}
                title="Suivant"
                aria-label="Suivant"
                className="circle-btn"
                style={arrowBtnStyle}
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* index */}
            <div
              style={{
                position: "absolute",
                right: 46,
                bottom: 150,
                zIndex: 5,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 74,
                  lineHeight: 0.8,
                  color: "#1c1c1c",
                  letterSpacing: "-.03em",
                }}
              >
                {projIndex}
              </span>
              <span
                style={{ fontFamily: MONO, fontSize: 15, color: "#a8a59b" }}
              >
                / {projTotal}
              </span>
            </div>
          </div>

          {/* DETAILS */}
          <div
            style={{
              position: "relative",
              background: "#ece8e0",
              borderTop: "1px solid rgba(0,0,0,.07)",
              padding: "46px 56px 60px",
              opacity: op,
              transition: "opacity .4s ease",
            }}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 34 }}>
              {statCards}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 1fr",
                gap: 48,
                alignItems: "start",
              }}
            >
              <div>
                <div style={sectionLabel}>Critères clés du projet</div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 15 }}
                >
                  {highlightEls}
                </div>
                <div style={{ ...sectionLabel, marginTop: 34 }}>
                  Stack technique
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {techEls}
                </div>
              </div>
              <div>
                <div style={sectionLabel}>Aperçus</div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {gallery.map((src) => (
                    <div
                      key={src}
                      style={{
                        borderRadius: 13,
                        overflow: "hidden",
                        border: "1px solid rgba(0,0,0,.08)",
                        aspectRatio: "16/10",
                        background: "#e9e7e0",
                      }}
                    >
                      {/* biome-ignore lint/performance/noImgElement: dynamic project gallery image */}
                      <img src={src} alt="" style={COVER_IMG} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================= MOBILE ============================= */}
      <div
        className="md:hidden"
        style={{
          position: "absolute",
          inset: 0,
          background: "#f4f1ea",
          overflow: "hidden",
          animation: "modalSheet .4s cubic-bezier(.16,.84,.36,1)",
        }}
      >
        <div
          ref={mScroll}
          style={{
            position: "absolute",
            inset: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 330,
              background: "#16161a",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: op,
                transition: "opacity .4s ease",
              }}
            >
              {/* biome-ignore lint/performance/noImgElement: dynamic project hero image */}
              <img src={mp.gallery[0]} alt={mp.name} style={COVER_IMG} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top,#f4f1ea 0%,rgba(244,241,234,.4) 40%,rgba(0,0,0,.15) 100%)",
              }}
            />
            <button
              type="button"
              onClick={onClose}
              title="Fermer"
              aria-label="Fermer"
              className="circle-btn"
              style={mobileCloseStyle}
            >
              <CloseIcon />
            </button>
            <div
              style={{
                position: "absolute",
                left: 22,
                bottom: 14,
                zIndex: 5,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 800,
                  fontSize: 52,
                  lineHeight: 0.8,
                  color: "#1c1c1c",
                  letterSpacing: "-.03em",
                }}
              >
                {projIndex}
              </span>
              <span
                style={{ fontFamily: MONO, fontSize: 13, color: "#8c897f" }}
              >
                / {projTotal}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "6px 22px 40px",
              opacity: op,
              transition: "opacity .4s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 7,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {tagEls}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: ".22em",
                color: "#9a978d",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              {mp.type}
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 42,
                lineHeight: 0.96,
                letterSpacing: "-.015em",
                color: "#1c1c1c",
                textTransform: "uppercase",
              }}
            >
              {mp.name}
            </div>
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.55,
                color: "#54514a",
                marginTop: 16,
              }}
            >
              {mp.overview}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 22,
                flexWrap: "wrap",
              }}
            >
              {actionButtons}
            </div>

            {/* switcher */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 24,
              }}
            >
              <button
                type="button"
                onClick={onPrev}
                title="Précédent"
                aria-label="Précédent"
                className="circle-btn"
                style={smallArrowStyle}
              >
                <ChevronLeftIcon size={16} />
              </button>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 9,
                  overflowX: "auto",
                  paddingBottom: 2,
                }}
              >
                {projects.map((p, i) => {
                  const on = i === index;
                  return (
                    <button
                      type="button"
                      key={p.name}
                      onClick={() => onSelect(i)}
                      style={{
                        position: "relative",
                        flex: "none",
                        width: 110,
                        height: 78,
                        borderRadius: 12,
                        overflow: "hidden",
                        padding: 0,
                        cursor: "pointer",
                        background: "#16161a",
                        border: on
                          ? "2px solid var(--accent,#f2611a)"
                          : "2px solid rgba(0,0,0,.12)",
                        opacity: on ? 1 : 0.75,
                      }}
                    >
                      {/* biome-ignore lint/performance/noImgElement: dynamic project thumbnail */}
                      <img src={p.gallery[0]} alt="" style={COVER_IMG} />
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top,rgba(0,0,0,.78) 0%,transparent 55%)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: 8,
                          right: 8,
                          bottom: 7,
                          textAlign: "left",
                          fontFamily: SANS,
                          fontWeight: 700,
                          fontSize: 11,
                          color: "#fff",
                          lineHeight: 1.1,
                        }}
                      >
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={onNext}
                title="Suivant"
                aria-label="Suivant"
                className="circle-btn"
                style={smallArrowStyle}
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
              {statCards}
            </div>

            <div style={{ ...sectionLabel, margin: "28px 0 16px" }}>
              Critères clés du projet
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {highlightEls}
            </div>

            <div style={{ ...sectionLabel, margin: "28px 0 14px" }}>
              Stack technique
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {techEls}
            </div>

            <div style={{ ...sectionLabel, margin: "28px 0 14px" }}>
              Aperçus
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {gallery.map((src) => (
                <div
                  key={src}
                  style={{
                    borderRadius: 13,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,.08)",
                    aspectRatio: "16/10",
                    background: "#e9e7e0",
                  }}
                >
                  {/* biome-ignore lint/performance/noImgElement: dynamic project gallery image */}
                  <img src={src} alt="" style={COVER_IMG} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 22,
  right: 24,
  zIndex: 12,
  width: 38,
  height: 38,
  borderRadius: "50%",
  cursor: "pointer",
  background: "rgba(0,0,0,.05)",
  border: "1px solid rgba(0,0,0,.14)",
  color: "#1c1c1c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mobileCloseStyle: React.CSSProperties = {
  position: "absolute",
  top: 18,
  right: 18,
  zIndex: 12,
  width: 38,
  height: 38,
  borderRadius: "50%",
  cursor: "pointer",
  background: "rgba(0,0,0,.35)",
  backdropFilter: "blur(6px)",
  border: "1px solid rgba(255,255,255,.25)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const arrowBtnStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  cursor: "pointer",
  background: "rgba(0,0,0,.05)",
  border: "1px solid rgba(0,0,0,.14)",
  color: "#1c1c1c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const smallArrowStyle: React.CSSProperties = {
  flex: "none",
  width: 40,
  height: 40,
  borderRadius: "50%",
  cursor: "pointer",
  background: "rgba(0,0,0,.05)",
  border: "1px solid rgba(0,0,0,.14)",
  color: "#1c1c1c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const critereBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  marginTop: 34,
  cursor: "pointer",
  background: "rgba(0,0,0,.04)",
  border: "1px solid rgba(0,0,0,.16)",
  borderRadius: 30,
  padding: "11px 18px",
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: ".12em",
  color: "#6b6860",
  textTransform: "uppercase",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 13,
  letterSpacing: ".04em",
  color: "#9a978d",
  marginBottom: 18,
};
