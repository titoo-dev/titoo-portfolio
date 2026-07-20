import { ChevronRight, ExternalLink, FolderOpen, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/lib/cv";
import { bebas } from "@/lib/tokens";

const overlayLinkStyle: React.CSSProperties = {
  background: "#B2BDA0",
  border: "2px solid #000000",
  boxShadow: "2px 2px 0px #000000",
  padding: 6,
  display: "flex",
  color: "#000000",
};

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const firstImage =
    "images" in project && project.images?.length ? project.images[0] : null;
  const rotation = index % 2 === 0 ? -0.5 : 0.5;

  return (
    <Reveal from={{ opacity: 0, y: 30 }} delay={index * 0.1}>
      <div
        className="group brutal-card"
        style={{
          background: "#F9FAF7",
          border: "4px solid #000000",
          boxShadow: "6px 6px 0px #000000",
          overflow: "hidden",
          position: "relative",
          cursor: "default",
          transform: `rotate(${rotation}deg)`,
          height: "100%",
        }}
      >
        {/* Accent bar on top */}
        <div style={{ height: 4, background: "#2C2C2C", width: "100%" }} />

        {/* Image area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 192,
            background: "#EDEFEA",
            borderBottom: "3px solid #000000",
            overflow: "hidden",
          }}
        >
          {firstImage ? (
            <Image
              src={firstImage}
              alt={project.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#EDEFEA",
              }}
            >
              <FolderOpen size={48} color="#cccccc" />
            </div>
          )}

          {/* Overlay with links on hover */}
          <div
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: 12,
              gap: 8,
              transition: "opacity 0.2s",
            }}
          >
            {project.url ? (
              <Link
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir ${project.name}`}
                style={overlayLinkStyle}
              >
                <ExternalLink size={16} />
              </Link>
            ) : null}
            {"github" in project && project.github ? (
              <Link
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Code source de ${project.name} sur GitHub`}
                style={overlayLinkStyle}
              >
                <Github size={16} />
              </Link>
            ) : null}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "1.25rem" }}>
          <h3
            className="group-hover:!text-[#2C2C2C]"
            style={{
              fontFamily: bebas,
              fontSize: "1.5rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#000000",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
              transition: "color 0.15s",
            }}
          >
            {project.name}
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#5A5A5A",
              lineHeight: 1.6,
              marginBottom: "0.75rem",
            }}
          >
            {project.description}
          </p>

          {/* Highlights */}
          {"highlights" in project &&
          project.highlights &&
          project.highlights.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {project.highlights.slice(0, 3).map((h) => (
                <li
                  key={h}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 6,
                    fontSize: "0.8rem",
                    color: "#5A5A5A",
                    marginBottom: 4,
                  }}
                >
                  <ChevronRight
                    size={12}
                    style={{ color: "#2C2C2C", flexShrink: 0, marginTop: 3 }}
                  />
                  <span style={{ lineHeight: 1.4 }}>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
