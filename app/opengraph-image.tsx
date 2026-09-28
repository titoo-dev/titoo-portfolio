import { ImageResponse } from "next/og";

export const alt =
  "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetch a Google font as TTF/WOFF (satori can't parse woff2) by requesting the
// CSS with a UA that doesn't advertise woff2 support.
async function loadGoogleFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`;
  const css = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1)",
    },
  }).then((r) => r.text());
  const src = css.match(
    /src: url\((.+?)\) format\('(truetype|opentype|woff)'\)/,
  );
  if (!src) throw new Error(`font not found: ${family}`);
  return fetch(src[1]).then((r) => r.arrayBuffer());
}

const BG = "#0a0a0a";
const FG = "#ededed";
const MUTED = "#a1a1a1";
const LINE = "#262626";

export default async function OgImage() {
  const [geist, geistMono] = await Promise.all([
    loadGoogleFont("Geist", 600),
    loadGoogleFont("Geist+Mono", 400),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: BG,
        color: FG,
        fontFamily: "Geist",
        padding: "48px",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          border: `1px solid ${LINE}`,
          padding: "56px 64px",
          backgroundImage: `radial-gradient(${LINE} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
              <rect width="24" height="24" rx="6" fill={FG} />
              <path d="M6.5 7h11v2.6h-4.2V18h-2.6V9.6H6.5Z" fill={BG} />
            </svg>
            <span style={{ fontSize: "26px" }}>Titosy Manankasina</span>
          </div>
          <span
            style={{ fontFamily: "Geist Mono", fontSize: "20px", color: MUTED }}
          >
            titosy.dev
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            fontSize: "76px",
            lineHeight: 1.05,
            letterSpacing: "-0.045em",
          }}
        >
          <span>Des produits web & mobile,</span>
          <span style={{ color: MUTED }}>du pixel à la prod.</span>
        </div>

        <div
          style={{
            marginTop: "44px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "20px",
            color: MUTED,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#1fd978",
                display: "flex",
              }}
            />
            Disponible — remote ou hybride
          </span>
          <span>React · Next.js · Flutter · Node.js</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, style: "normal", weight: 600 },
        { name: "Geist Mono", data: geistMono, style: "normal", weight: 400 },
      ],
    },
  );
}
