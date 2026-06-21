"use client";

import { useEffect, useRef } from "react";
import type { Career } from "@/lib/portfolio-data";
import {
  ArrowDownIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  PinIcon,
} from "./icons";

const MONO = "var(--font-mono),monospace";
const SANS = "var(--font-sans),sans-serif";

export function CareerModal({
  careers,
  index,
  fade,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  careers: Career[];
  index: number;
  fade: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  const dScroll = useRef<HTMLDivElement>(null);
  const mScroll = useRef<HTMLDivElement>(null);
  const cc = careers[index];
  const op = fade ? 0 : 1;

  // biome-ignore lint/correctness/useExhaustiveDependencies: index is the intended trigger
  useEffect(() => {
    if (dScroll.current) dScroll.current.scrollTop = 0;
    if (mScroll.current) mScroll.current.scrollTop = 0;
  }, [index]);

  const careerIndex = String(index + 1).padStart(2, "0");
  const careerTotal = String(careers.length).padStart(2, "0");
  const tags = cc.skills.slice(0, 3);
  const resp = cc.responsibilities.map((text, i) => ({
    n: String(i + 1).padStart(2, "0"),
    text,
  }));

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

  const statusBadge = cc.current ? (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        border: "1px solid rgba(31,157,77,.45)",
        borderRadius: 24,
        padding: "4px 12px",
        fontFamily: MONO,
        fontSize: 11,
        color: "#2b2b2b",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#1f9d4d",
          boxShadow: "0 0 0 3px rgba(43,204,99,.2)",
        }}
      />
      En poste
    </span>
  ) : null;

  const metaRow = (
    <>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: MONO,
          fontSize: 12.5,
          color: "#6b6860",
        }}
      >
        <CalendarIcon />
        {cc.period}
      </span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: MONO,
          fontSize: 12.5,
          color: "#6b6860",
        }}
      >
        <PinIcon />
        {cc.location}
      </span>
    </>
  );

  const respEls = resp.map((r) => (
    <div
      key={r.n}
      style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
    >
      <span style={numBadge}>{r.n}</span>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "#54514a" }}>
        {r.text}
      </div>
    </div>
  ));

  const achEls = cc.achievements.map((a) => (
    <div
      key={a}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        background: "#fff",
        border: "1px solid rgba(0,0,0,.08)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <CheckIcon />
      <div style={{ fontSize: 14, lineHeight: 1.5, color: "#54514a" }}>{a}</div>
    </div>
  ));

  const skillEls = cc.skills.map((s) => (
    <span
      key={s}
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
      {s}
    </span>
  ));

  const careerNav = (compact: boolean) =>
    careers.map((c, i) => {
      const on = i === index;
      const short = c.period.split(" — ")[0].replace(/^[A-Za-zéû.]+\s/, "");
      return (
        <button
          type="button"
          key={c.company}
          onClick={() => onSelect(i)}
          style={{
            position: "relative",
            flex: "none",
            width: compact ? 96 : 118,
            height: 96,
            borderRadius: 13,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: 10,
            transition: "all .22s ease",
            background: on ? "rgba(0,0,0,.06)" : "rgba(0,0,0,.025)",
            border: on
              ? "2px solid var(--accent,#f2611a)"
              : "2px solid rgba(0,0,0,.12)",
            boxShadow: on
              ? "0 14px 32px rgba(0,0,0,.16)"
              : "0 6px 16px rgba(0,0,0,.08)",
            transform: on ? "translateY(-8px)" : "translateY(0)",
            opacity: on ? 1 : 0.72,
          }}
        >
          <span
            style={{
              flex: "none",
              width: 34,
              height: 34,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 14,
              marginBottom: 2,
              background: on ? "var(--accent,#f2611a)" : "rgba(0,0,0,.06)",
              color: on ? "#fff" : "#6b6860",
            }}
          >
            {c.initial}
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 12.5,
              color: "#1c1c1c",
              lineHeight: 1.15,
              textAlign: "center",
            }}
          >
            {c.company}
          </span>
          {!compact && (
            <span style={{ fontFamily: MONO, fontSize: 9, color: "#9a978d" }}>
              {short}
            </span>
          )}
        </button>
      );
    });

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
            background:
              "radial-gradient(120% 120% at 78% 18%,#fbf9f4 0%,#efece4 48%,#e7e3da 100%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-2%",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 520,
            lineHeight: 0.7,
            color: "rgba(0,0,0,.05)",
            opacity: op,
            transition: "opacity .35s ease",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {cc.initial}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(101deg,rgba(244,241,234,.96) 0%,rgba(244,241,234,.88) 30%,rgba(244,241,234,.45) 62%,rgba(244,241,234,.1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
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
                maxWidth: 580,
                opacity: op,
                transition: "opacity .35s ease",
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
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: ".24em",
                    color: "#9a978d",
                    textTransform: "uppercase",
                  }}
                >
                  {cc.type}
                </span>
                {statusBadge}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 58,
                  lineHeight: 0.95,
                  letterSpacing: "-.015em",
                  color: "#1c1c1c",
                  textTransform: "uppercase",
                }}
              >
                {cc.company}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--accent,#f2611a)",
                  marginTop: 12,
                }}
              >
                {cc.role}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 18,
                  marginTop: 16,
                }}
              >
                {metaRow}
              </div>
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "#54514a",
                  marginTop: 22,
                  maxWidth: 470,
                }}
              >
                {cc.summary}
              </div>
              <button
                type="button"
                onClick={scrollDetails}
                className="ghost-btn"
                style={detailBtnStyle}
              >
                <ArrowDownIcon
                  style={{
                    display: "block",
                    animation: "nudge 1.6s ease-in-out infinite",
                  }}
                />
                Voir le détail
              </button>
            </div>

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
              {careerNav(false)}
            </div>

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
                {careerIndex}
              </span>
              <span
                style={{ fontFamily: MONO, fontSize: 15, color: "#a8a59b" }}
              >
                / {careerTotal}
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
              transition: "opacity .35s ease",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: 48,
                alignItems: "start",
              }}
            >
              <div>
                {resp.length > 0 && (
                  <>
                    <div style={sectionLabel}>Responsabilités</div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 15,
                      }}
                    >
                      {respEls}
                    </div>
                  </>
                )}
              </div>
              <div>
                {cc.achievements.length > 0 && (
                  <>
                    <div style={{ ...sectionLabel, marginBottom: 16 }}>
                      Réalisations
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 11,
                      }}
                    >
                      {achEls}
                    </div>
                  </>
                )}
                {cc.skills.length > 0 && (
                  <>
                    <div
                      style={{
                        ...sectionLabel,
                        marginTop: cc.achievements.length > 0 ? 30 : 0,
                        marginBottom: 14,
                      }}
                    >
                      Compétences
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {skillEls}
                    </div>
                  </>
                )}
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
          overflow: "hidden",
          background:
            "radial-gradient(120% 80% at 78% 8%,#fbf9f4 0%,#efece4 52%,#e7e3da 100%)",
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
          <div style={{ position: "relative", padding: "54px 22px 26px" }}>
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: -6,
                top: 8,
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 240,
                lineHeight: 0.7,
                color: "rgba(0,0,0,.05)",
                pointerEvents: "none",
                userSelect: "none",
                opacity: op,
                transition: "opacity .35s ease",
              }}
            >
              {cc.initial}
            </span>
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
                position: "relative",
                zIndex: 2,
                opacity: op,
                transition: "opacity .35s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 44,
                    lineHeight: 0.8,
                    color: "#1c1c1c",
                    letterSpacing: "-.03em",
                  }}
                >
                  {careerIndex}
                </span>
                <span
                  style={{ fontFamily: MONO, fontSize: 12, color: "#a8a59b" }}
                >
                  / {careerTotal}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: ".22em",
                    color: "#9a978d",
                    textTransform: "uppercase",
                  }}
                >
                  {cc.type}
                </span>
                {statusBadge}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontWeight: 900,
                  fontSize: 40,
                  lineHeight: 0.96,
                  letterSpacing: "-.015em",
                  color: "#1c1c1c",
                  textTransform: "uppercase",
                }}
              >
                {cc.company}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--accent,#f2611a)",
                  marginTop: 11,
                }}
              >
                {cc.role}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                {metaRow}
              </div>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "#54514a",
                  marginTop: 18,
                }}
              >
                {cc.summary}
              </div>
            </div>
          </div>

          {/* switcher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 22px",
              position: "relative",
              zIndex: 2,
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
              {careerNav(true)}
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

          {/* details */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              background: "#ece8e0",
              borderTop: "1px solid rgba(0,0,0,.07)",
              marginTop: 26,
              padding: "28px 22px 40px",
              opacity: op,
              transition: "opacity .35s ease",
            }}
          >
            {resp.length > 0 && (
              <>
                <div style={{ ...sectionLabel, marginBottom: 16 }}>
                  Responsabilités
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                    marginBottom: 28,
                  }}
                >
                  {respEls}
                </div>
              </>
            )}
            {cc.achievements.length > 0 && (
              <>
                <div style={{ ...sectionLabel, marginBottom: 14 }}>
                  Réalisations
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 28,
                  }}
                >
                  {achEls}
                </div>
              </>
            )}
            {cc.skills.length > 0 && (
              <>
                <div style={{ ...sectionLabel, marginBottom: 14 }}>
                  Compétences
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skillEls}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const numBadge: React.CSSProperties = {
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
};

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
  background: "rgba(0,0,0,.05)",
  border: "1px solid rgba(0,0,0,.14)",
  color: "#1c1c1c",
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

const detailBtnStyle: React.CSSProperties = {
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
