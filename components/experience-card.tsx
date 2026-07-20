import { ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { Job } from "@/lib/cv";
import { bebas } from "@/lib/tokens";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Aujourd'hui";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

/** Timeline item: diamond dot + date label + job card. */
export function ExperienceCard({ job, index }: { job: Job; index: number }) {
  const rotation = index % 2 === 0 ? -0.3 : 0.3;

  return (
    <Reveal
      from={{ opacity: 0, x: -20 }}
      delay={index * 0.15}
      style={{ position: "relative", marginBottom: "3rem" }}
    >
      {/* Diamond timeline dot */}
      <div
        style={{
          position: "absolute",
          left: -32,
          top: 12,
          width: 16,
          height: 16,
          background: "#2C2C2C",
          border: "3px solid #000000",
          boxShadow: "2px 2px 0px #000000",
          transform: "rotate(45deg)",
        }}
      />

      {/* Date label */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "0.8rem",
          color: "#000000",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}
      >
        {formatDate(job.startDate)} — {formatDate(job.endDate)}
      </div>

      {/* Card */}
      <div
        className="brutal-card"
        style={{
          background: "#F9FAF7",
          border: "4px solid #000000",
          boxShadow: "6px 6px 0px #000000",
          padding: "1.5rem",
          transform: `rotate(${rotation}deg)`,
          position: "relative",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
          <div>
            <h3
              style={{
                fontFamily: bebas,
                fontSize: "1.5rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#000000",
                lineHeight: 1.1,
              }}
            >
              {job.position}
            </h3>
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#2C2C2C",
              }}
            >
              {job.name}
              {job.url ? (
                <Link
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Site web de ${job.name}`}
                  style={{ marginLeft: 6, color: "#2C2C2C" }}
                >
                  <ExternalLink
                    size={14}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />
                </Link>
              ) : null}
            </p>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#5A5A5A",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            {job.location_type} &bull; {job.location}
          </span>
        </div>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#5A5A5A",
            lineHeight: 1.6,
            marginBottom: "1rem",
          }}
        >
          {job.summary}
        </p>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem 0" }}>
            {job.responsibilities.map((r) => (
              <li
                key={r}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: "0.85rem",
                  color: "#5A5A5A",
                  marginBottom: 4,
                }}
              >
                <ChevronRight
                  size={14}
                  style={{ color: "#2C2C2C", flexShrink: 0, marginTop: 3 }}
                />
                {r}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Skill tags */}
        {job.skills && job.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  background: "#000000",
                  color: "#B2BDA0",
                  border: "2px solid #000000",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "4px 10px",
                  display: "inline-block",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : null}

        {/* "COMPLETED" stamp for ended positions */}
        {job.endDate ? (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontFamily: bebas,
              fontSize: "0.7rem",
              color: "#2C2C2C",
              border: "2px solid #2C2C2C",
              padding: "2px 8px",
              transform: "rotate(6deg)",
              opacity: 0.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              pointerEvents: "none",
            }}
          >
            Termine
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
