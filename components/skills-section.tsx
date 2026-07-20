import { Wrench } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { SkillChip } from "@/components/skill-chip";
import { cv } from "@/lib/cv";

export function SkillsSection() {
  return (
    <section
      id="competences"
      style={{ borderBottom: "4px solid #000000" }}
      className="py-12"
    >
      <SectionHeader
        icon={<Wrench size={14} />}
        badge="Competences"
        title="Technologies & Outils"
      />

      <div className="flex flex-wrap justify-center gap-4">
        {cv.skills.map((skill, index) => (
          <SkillChip key={skill.name} name={skill.name} index={index} />
        ))}
      </div>
    </section>
  );
}
