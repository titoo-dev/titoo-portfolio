import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { WorkSection } from "@/components/work-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { Footer } from "@/components/footer";
import { HeroBackground } from "@/components/hero-background";
import cvData from "@/cv.json";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <HeroBackground />
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <HeroSection
          name={cvData.basics.name}
          label={cvData.basics.label}
          summary={cvData.basics.summary}
          email={cvData.basics.email}
          phone={cvData.basics.phone}
          image={cvData.basics.image}
          profiles={cvData.basics.profiles}
        />

        <ServicesSection />

        <WorkSection experiences={cvData.work} />

        <ProjectsSection projects={cvData.projects} />

        <SkillsSection skills={cvData.skills} />

        <Footer />
      </div>
    </div>
  );
}
