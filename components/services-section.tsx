import { Code2, Palette, Rocket, Smartphone, Wrench } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { type Service, ServiceCard } from "@/components/service-card";

const services: Service[] = [
  {
    icon: Code2,
    title: "Developpement Web",
    description:
      "Applications web modernes et performantes avec React, Next.js et TypeScript.",
    features: [
      "Applications React/Next.js",
      "Sites web responsives",
      "Progressive Web Apps",
      "Integration API",
    ],
  },
  {
    icon: Smartphone,
    title: "Applications Mobile",
    description:
      "Applications mobiles cross-platform avec Flutter. Experience fluide sur iOS et Android.",
    features: [
      "Applications Flutter",
      "UI/UX mobile",
      "Integration Firebase",
      "App Store & Play Store",
    ],
  },
  {
    icon: Palette,
    title: "Design UI/UX",
    description:
      "Interfaces elegantes et accessibles avec Figma. Des designs modernes qui captivent.",
    features: [
      "Prototypage Figma",
      "Design System",
      "Interface responsive",
      "Accessibilite",
    ],
  },
  {
    icon: Rocket,
    title: "Consulting & Formation",
    description:
      "Accompagnement technique et formation de vos equipes sur les technologies modernes.",
    features: [
      "Audit technique",
      "Formation React/Flutter",
      "Code review",
      "Best practices",
    ],
  },
];

export function ServicesSection() {
  return (
    <section
      id="services"
      style={{ borderBottom: "4px solid #000000" }}
      className="py-12"
    >
      <SectionHeader
        icon={<Wrench size={14} />}
        badge="Services"
        title="Comment puis-je vous aider ?"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
