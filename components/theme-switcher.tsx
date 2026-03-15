"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme, type Theme } from "./theme-provider";

interface ThemeOption {
  id: Theme;
  label: string;
  shortLabel: string;
  route: string;
  preview: string;
  textColor: string;
  accentColor: string;
  description: string;
}

const themes: ThemeOption[] = [
  {
    id: "default",
    label: "Default",
    shortLabel: "DEF",
    route: "/",
    preview: "linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 50%, #d0d0d0 100%)",
    textColor: "#111111",
    accentColor: "#000000",
    description: "Clean & Modern",
  },
  {
    id: "minimal",
    label: "Minimal",
    shortLabel: "MIN",
    route: "/minimal",
    preview: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #efefef 100%)",
    textColor: "#333333",
    accentColor: "#888888",
    description: "Barely There",
  },
  {
    id: "tech-gradient",
    label: "Tech",
    shortLabel: "TCH",
    route: "/tech-gradient",
    preview:
      "linear-gradient(135deg, #0a0a2e 0%, #0d1b4b 30%, #1a0533 70%, #0f0f1a 100%)",
    textColor: "#00ffff",
    accentColor: "#7b2fff",
    description: "Neon & Cyber",
  },
  {
    id: "brutalism",
    label: "Brutal",
    shortLabel: "BRT",
    route: "/brutalism",
    preview:
      "linear-gradient(135deg, #ffe500 0%, #ffb800 40%, #ff6b00 80%, #ff4500 100%)",
    textColor: "#000000",
    accentColor: "#000000",
    description: "Raw & Bold",
  },
  {
    id: "gamification",
    label: "Game",
    shortLabel: "GAM",
    route: "/gamification",
    preview:
      "linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 30%, #0a2a0a 70%, #001a00 100%)",
    textColor: "#00ff41",
    accentColor: "#39ff14",
    description: "Level Up",
  },
  {
    id: "grid-modular",
    label: "Grid",
    shortLabel: "GRD",
    route: "/grid-modular",
    preview:
      "linear-gradient(135deg, #f5f2ee 0%, #ede8e0 40%, #e0d8cc 70%, #d4cabb 100%)",
    textColor: "#1a1a1a",
    accentColor: "#6b5c4a",
    description: "Editorial",
  },
];

export function ThemeSwitcher() {
  const { theme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<Theme | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes.find((t) => t.id === theme) ?? themes[0];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.75rem",
        fontFamily: "'DM Sans', 'Geist Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "28rem" : "0",
          opacity: open ? 1 : 0,
          transition: "max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div
          style={{
            background: "rgba(10, 10, 10, 0.92)",
            backdropFilter: "blur(8px) saturate(180%)",
            WebkitBackdropFilter: "blur(8px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "1rem",
            padding: "1rem",
            width: "200px",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.5), 0 8px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              fontSize: "0.6rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              padding: "0.25rem 0.5rem 0.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              marginBottom: "0.25rem",
            }}
          >
            Theme
          </div>

          {themes.map((option) => {
            const isActive = theme === option.id;
            const isHovered = hoveredId === option.id;

            return (
              <button
                key={option.id}
                onClick={() => {
                  router.push(option.route);
                  setOpen(false);
                }}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.55rem 0.5rem",
                  borderRadius: "0.5rem",
                  background: isActive
                    ? "rgba(255,255,255,0.1)"
                    : isHovered
                    ? "rgba(255,255,255,0.06)"
                    : "transparent",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.2s ease",
                  outline: "none",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "28px",
                    borderRadius: "0.35rem",
                    background: option.preview,
                    flexShrink: 0,
                    border: isActive
                      ? "1.5px solid rgba(255,255,255,0.6)"
                      : "1px solid rgba(255,255,255,0.12)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <div
                      style={{
                        height: "2.5px",
                        background: option.textColor,
                        opacity: 0.7,
                        borderRadius: "1px",
                        width: "65%",
                      }}
                    />
                    <div
                      style={{
                        height: "1.5px",
                        background: option.textColor,
                        opacity: 0.35,
                        borderRadius: "1px",
                        width: "100%",
                      }}
                    />
                    <div
                      style={{
                        height: "1.5px",
                        background: option.textColor,
                        opacity: 0.25,
                        borderRadius: "1px",
                        width: "80%",
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: isActive ? 500 : 400,
                      color: isActive
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.7)",
                      lineHeight: 1.2,
                      transition: "color 0.2s ease",
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: "rgba(255,255,255,0.3)",
                      lineHeight: 1.2,
                      marginTop: "1px",
                    }}
                  >
                    {option.description}
                  </div>
                </div>

                {isActive && (
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.8)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle theme switcher"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem 0.5rem 0.65rem",
          background: "rgba(10, 10, 10, 0.88)",
          backdropFilter: "blur(8px) saturate(180%)",
          WebkitBackdropFilter: "blur(8px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "2rem",
          cursor: "pointer",
          outline: "none",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
          transform: open ? "scale(0.97)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(20, 20, 20, 0.95)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 0 1px rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(10, 10, 10, 0.88)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)";
        }}
      >
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: currentTheme.preview,
            border: "1.5px solid rgba(255,255,255,0.25)",
            flexShrink: 0,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg) scale(0.9)" : "rotate(0deg) scale(1)",
          }}
        />

        <span
          style={{
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
            userSelect: "none",
            lineHeight: 1,
            minWidth: "2.2rem",
          }}
        >
          {currentTheme.shortLabel}
        </span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            color: "rgba(255,255,255,0.4)",
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
