import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { bebas } from "@/lib/tokens";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
};

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = service.icon;
  const rotation = index % 2 === 0 ? -0.5 : 0.5;

  return (
    <Reveal from={{ opacity: 0, y: 30 }} delay={index * 0.1}>
      <div
        className="brutal-card"
        style={{
          background: "#F9FAF7",
          border: "4px solid #000000",
          boxShadow: "6px 6px 0px #000000",
          padding: "2rem",
          transform: `rotate(${rotation}deg)`,
          cursor: "default",
          height: "100%",
        }}
      >
        {/* Icon box */}
        <div
          style={{
            width: 48,
            height: 48,
            background: "#B2BDA0",
            border: "3px solid #000000",
            boxShadow: "2px 2px 0px #000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Icon size={24} color="#000000" />
        </div>

        <h3
          style={{
            fontFamily: bebas,
            fontSize: "1.5rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#000000",
            marginBottom: "0.5rem",
          }}
        >
          {service.title}
        </h3>

        <p
          style={{
            color: "#5A5A5A",
            lineHeight: 1.6,
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {service.description}
        </p>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {service.features.map((f) => (
            <li
              key={f}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.85rem",
                color: "#5A5A5A",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: "#2C2C2C",
                  flexShrink: 0,
                }}
              />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
