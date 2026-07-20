import { FolderOpen } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { cv } from "@/lib/cv";

export function ProjectsSection() {
  return (
    <section
      id="projets"
      style={{ borderBottom: "4px solid #000000" }}
      className="py-12"
    >
      <SectionHeader
        icon={<FolderOpen size={14} />}
        badge="Projets"
        title="Realisations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cv.projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
