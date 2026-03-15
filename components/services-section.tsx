"use client";

import { Code2, Smartphone, Palette, Rocket } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Code2,
    title: "Développement Web",
    description: "Création d'applications web modernes et performantes avec React, Next.js et TypeScript. Des interfaces intuitives qui convertissent vos visiteurs en clients.",
    features: ["Applications React/Next.js", "Sites web responsives", "Progressive Web Apps", "Intégration API"]
  },
  {
    icon: Smartphone,
    title: "Applications Mobile",
    description: "Développement d'applications mobiles natives et cross-platform avec Flutter. Une expérience utilisateur fluide sur iOS et Android.",
    features: ["Applications Flutter", "UI/UX mobile", "Intégration Firebase", "App Store & Play Store"]
  },
  {
    icon: Palette,
    title: "Design UI/UX",
    description: "Conception d'interfaces élégantes et accessibles avec Figma. Je transforme vos idées en designs modernes qui captivent vos utilisateurs.",
    features: ["Prototypage Figma", "Design System", "Interface responsive", "Accessibilité"]
  },
  {
    icon: Rocket,
    title: "Consulting & Formation",
    description: "Accompagnement technique et formation de vos équipes sur les technologies modernes. Optimisation de vos processus de développement.",
    features: ["Audit technique", "Formation React/Flutter", "Code review", "Best practices"]
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-20 border-t border-border relative overflow-hidden">
      <div className="absolute top-0 -right-20 md:-right-36 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 md:-left-36 w-72 h-72 bg-gradient-to-tr from-primary/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Services
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Comment puis-je vous aider ?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Je transforme vos idées en solutions digitales performantes et élégantes
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              className="group relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 transition-all hover:border-foreground/20 hover:shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 border border-primary/10 rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 border border-primary/5 rounded-full" />
              
              <div className="flex flex-col gap-4 relative z-10">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
