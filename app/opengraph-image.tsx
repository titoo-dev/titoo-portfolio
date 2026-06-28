import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch a Google font as TTF (satori can't parse woff2) by requesting the CSS
// with a UA that doesn't advertise woff2 support.
async function loadGoogleFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`;
  const css = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1)",
    },
  }).then((r) => r.text());
  const src = css.match(/src: url\((.+?)\) format\('(truetype|opentype)'\)/);
  if (!src) throw new Error(`font not found: ${family}`);
  return fetch(src[1]).then((r) => r.arrayBuffer());
}

export default async function OgImage() {
  const [schibsted, spaceMono] = await Promise.all([
    loadGoogleFont("Schibsted+Grotesk", 800),
    loadGoogleFont("Space+Mono", 400),
  ]);

  const SANS = "Schibsted Grotesk";
  const MONO = "Space Mono";
  const ACCENT = "#f2611a";

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#f1f0ec",
        color: "#1c1c1c",
        padding: "70px 80px",
        fontFamily: SANS,
        position: "relative",
      }}
    >
      {/* Top row — logo + meta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              position: "relative",
              width: "58px",
              height: "58px",
              borderRadius: "17px",
              background: "#1c1c1c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 7px 20px rgba(0,0,0,.24)",
            }}
          >
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: "30px",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              T
            </span>
            <div
              style={{
                position: "absolute",
                right: "8px",
                bottom: "8px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: ACCENT,
                display: "flex",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "24px",
              color: "#1c1c1c",
            }}
          >
            Titosy Manankasina
          </span>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: "20px",
            letterSpacing: "0.06em",
            color: "#9a978d",
          }}
        >
          ANTANANARIVO, MG
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: "76px",
          lineHeight: 1.04,
          letterSpacing: "-0.025em",
        }}
      >
        <div style={{ display: "flex", color: "#1c1c1c" }}>
          Salut, moi c&apos;est Titosy.
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ color: "#bdbab1" }}>Je crée des apps</span>
          <span style={{ color: "#1c1c1c" }}>&nbsp;web &amp; mobile</span>
        </div>
        <div style={{ display: "flex", color: ACCENT }}>
          JavaScript &amp; Flutter.
        </div>
      </div>

      {/* Bottom row */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: MONO,
          fontSize: "20px",
          letterSpacing: "0.04em",
          color: "#6b6860",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#2bcc63",
              display: "flex",
            }}
          />
          Disponible — remote ou hybride
        </span>
        <span style={{ display: "flex" }}>
          React · Next.js · TypeScript · Flutter
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: SANS, data: schibsted, style: "normal", weight: 800 },
        { name: MONO, data: spaceMono, style: "normal", weight: 400 },
      ],
    },
  );
}
