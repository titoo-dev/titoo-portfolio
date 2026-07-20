import { Heart, Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cv } from "@/lib/cv";
import { bebas } from "@/lib/tokens";

export function SiteFooter() {
  const { basics } = cv;

  return (
    <footer
      style={{
        background: "#B2BDA0",
        borderTop: "4px solid #000000",
        padding: "2rem 1.5rem",
      }}
    >
      <Reveal className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="text-center md:text-left">
          <h3
            style={{
              fontFamily: bebas,
              fontSize: "2rem",
              textTransform: "uppercase",
              color: "#000000",
              marginBottom: "0.25rem",
            }}
          >
            Travaillons ensemble
          </h3>
          <p style={{ color: "#000000", fontWeight: 500 }}>
            Vous avez un projet en tete ? Discutons-en !
          </p>
        </div>

        <a
          href={`mailto:${basics.email}`}
          className="brutal-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#000000",
            color: "#B2BDA0",
            border: "3px solid #000000",
            boxShadow: "4px 4px 0px #000000",
            fontWeight: 700,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "12px 24px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <Mail size={16} /> Contactez-moi
        </a>
      </Reveal>

      <div
        style={{ borderTop: "3px solid #000000", paddingTop: "1.5rem" }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "#000000" }}>
          &copy; {new Date().getFullYear()} {basics.name}. Tous droits reserves.
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#000000",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Concu avec <Heart size={16} fill="#2C2C2C" color="#2C2C2C" /> a
          Madagascar
        </p>
      </div>
    </footer>
  );
}
