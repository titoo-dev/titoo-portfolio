import { Reveal } from "@/components/reveal";

export function SkillChip({ name, index }: { name: string; index: number }) {
  return (
    <Reveal
      from={{ opacity: 0, scale: 0.8 }}
      delay={index * 0.05}
      duration={0.3}
    >
      <div
        className="brutal-chip"
        style={{
          background: "#B2BDA0",
          border: "3px solid #000000",
          boxShadow: "3px 3px 0px #000000",
          fontWeight: 700,
          fontSize: "0.85rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          padding: "10px 18px",
          cursor: "default",
          color: "#000000",
        }}
      >
        {name}
      </div>
    </Reveal>
  );
}
