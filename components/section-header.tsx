import { Reveal } from "@/components/reveal";
import { bebas } from "@/lib/tokens";

const badgeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "#B2BDA0",
  color: "#000000",
  border: "3px solid #000000",
  boxShadow: "3px 3px 0px #000000",
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  padding: "6px 14px",
};

const titleStyle: React.CSSProperties = {
  fontFamily: bebas,
  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
  lineHeight: 1,
  textTransform: "uppercase",
  color: "#000000",
  marginTop: "0.5rem",
  display: "block",
  position: "relative",
};

export function SectionHeader({
  icon,
  badge,
  title,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
}) {
  return (
    <Reveal className="text-center mb-12">
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <span style={badgeStyle}>
          {icon} {badge}
        </span>
        <h2 style={titleStyle}>{title}</h2>
      </div>
    </Reveal>
  );
}
