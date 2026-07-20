import { Briefcase } from "lucide-react";
import { ExperienceCard } from "@/components/experience-card";
import { SectionHeader } from "@/components/section-header";
import { cv } from "@/lib/cv";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      style={{ borderBottom: "4px solid #000000" }}
      className="py-12"
    >
      <SectionHeader
        icon={<Briefcase size={14} />}
        badge="Experience"
        title="Parcours professionnel"
      />

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {/* Bold vertical bar */}
        <div
          style={{
            position: "absolute",
            left: 6,
            top: 0,
            bottom: 0,
            width: 4,
            background: "#000000",
          }}
        />

        {cv.work.map((job, index) => (
          <ExperienceCard key={job.name} job={job} index={index} />
        ))}
      </div>
    </section>
  );
}
