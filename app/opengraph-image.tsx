import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Titosy Manankasina — Développeur Fullstack JavaScript & Flutter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const departureMono = await fetch(
    new URL("./fonts/DepartureMono-Regular.otf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#b2b1b1",
        color: "#1f1e1c",
        padding: "80px 90px",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      {/* Top meta row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "DepartureMono",
          fontSize: "22px",
          letterSpacing: "0.08em",
          color: "#56554f",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <svg width="27" height="27" viewBox="0 0 9 9" aria-hidden="true">
            <path
              d="M4 0h1v3H4zM4 6h1v3H4zM0 4h3v1H0zM6 4h3v1H6zM1 1h1v1H1zM7 1h1v1H7zM1 7h1v1H1zM7 7h1v1H7zM2 2h1v1H2zM6 2h1v1H6zM2 6h1v1H2zM6 6h1v1H6z"
              fill="#1d5a57"
            />
          </svg>
          TITOSY.DEV
        </span>
        <span>ANTANANARIVO, MG — GMT+3</span>
      </div>

      {/* Name */}
      <div
        style={{
          marginTop: "110px",
          fontFamily: "DepartureMono",
          fontSize: "66px",
          lineHeight: 1.1,
          display: "flex",
        }}
      >
        Titosy Manankasina
      </div>

      {/* Square-wave underline */}
      <svg
        width="452"
        height="36"
        viewBox="0 0 113 9"
        style={{ marginTop: "28px" }}
        aria-hidden="true"
      >
        <path
          d="M0.5 7.5h14v-5h14v5h14v-5h14v5h14v-5h14v5h14v-5h14"
          stroke="#1d5a57"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* Role */}
      <div
        style={{
          marginTop: "30px",
          fontSize: "30px",
          color: "#45443f",
          display: "flex",
        }}
      >
        Développeur Fullstack — JavaScript & Flutter
      </div>

      {/* Bottom row */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "DepartureMono",
          fontSize: "22px",
          letterSpacing: "0.08em",
          color: "#56554f",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              width: "14px",
              height: "14px",
              background: "#256b68",
              display: "flex",
            }}
          />
          DISPONIBLE — REMOTE
        </span>
        <span>REACT · NEXT.JS · TYPESCRIPT · FLUTTER</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "DepartureMono",
          data: departureMono,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
