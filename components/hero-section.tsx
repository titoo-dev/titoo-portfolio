import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { SocialLink } from "@/components/social-link";
import { cv } from "@/lib/cv";
import { bebas } from "@/lib/tokens";

const networkIcon: Record<string, string> = {
  LinkedIn: "in",
  GitHub: "GH",
};

export function HeroSection() {
  const { basics } = cv;

  return (
    <section
      id="a-propos"
      style={{ borderBottom: "4px solid #000000" }}
      className="py-12 md:py-16"
    >
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Profile image — SQUARE */}
        <div className="flex-shrink-0 anim-pop">
          <div
            style={{
              width: 160,
              height: 160,
              border: "5px solid #000000",
              boxShadow: "6px 6px 0px #000000",
              overflow: "hidden",
              background: "#F9FAF7",
            }}
          >
            <Image
              src={basics.image}
              alt={basics.name}
              width={160}
              height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        <div className="flex-1">
          {/* Available badge — rubber stamp */}
          <div className="anim-pop">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#000000",
                color: "#B2BDA0",
                padding: "6px 14px",
                border: "3px solid #000000",
                boxShadow: "3px 3px 0px #B2BDA0",
                fontWeight: 700,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  background: "#B2BDA0",
                  display: "inline-block",
                }}
              />
              Disponible
            </span>
          </div>

          {/* Name — MASSIVE */}
          <div className="anim-slide anim-d1">
            <h1
              style={{
                fontFamily: bebas,
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                lineHeight: 0.95,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
                color: "#000000",
                marginBottom: "0.5rem",
              }}
            >
              {basics.name}
            </h1>
          </div>

          {/* Label — accent left border */}
          <div className="anim-slide anim-d2">
            <p
              style={{
                fontWeight: 700,
                color: "#2C2C2C",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                fontSize: "1.1rem",
                borderLeft: "5px solid #2C2C2C",
                paddingLeft: 12,
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {basics.label}
            </p>
          </div>

          {/* Summary — black left border */}
          <div className="anim-rise anim-d3">
            <p
              style={{
                fontSize: "1rem",
                color: "#5A5A5A",
                lineHeight: 1.7,
                borderLeft: "3px solid #000000",
                paddingLeft: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {basics.summary}
            </p>
          </div>

          {/* Social links — thick underline */}
          <div className="flex flex-wrap items-center gap-4 anim-rise anim-d4">
            {basics.profiles.map((p) => (
              <SocialLink key={p.network} href={p.url}>
                {networkIcon[p.network] || p.network} / {p.username}
              </SocialLink>
            ))}

            <SocialLink href={`mailto:${basics.email}`}>
              <Mail size={14} /> Email
            </SocialLink>

            <SocialLink href={`tel:${basics.phone}`}>
              <Phone size={14} /> Tel
            </SocialLink>
          </div>
        </div>
      </div>
    </section>
  );
}
