import { BrutalStyles } from "@/components/brutal-styles";
import { ExperienceSection } from "@/components/experience-section";
import { HeroSection } from "@/components/hero-section";
import { ProjectsSection } from "@/components/projects-section";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SkillsSection } from "@/components/skills-section";
import { grotesk } from "@/lib/tokens";

export default function BrutalismPage() {
  return (
    <>
      <BrutalStyles />

      <div
        className="min-h-screen relative overflow-x-hidden"
        style={{ fontFamily: grotesk, zIndex: 1, position: "relative" }}
      >
        {/* Main white content container */}
        <main
          className="max-w-5xl mx-auto px-6 md:px-8"
          style={{
            background: "#F9FAF7",
            border: "4px solid #000000",
            boxShadow: "8px 8px 0px #000000",
            marginTop: "2rem",
            marginBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <HeroSection />
          <ServicesSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <SiteFooter />
        </main>
      </div>
    </>
  );
}
