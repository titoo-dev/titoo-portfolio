"use client";

import { motion } from "motion/react";

interface WorkExperience {
  name: string;
  position: string;
  location_type: string;
  location: string;
  url?: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
}

interface WorkSectionProps {
  experiences: WorkExperience[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "short" });
};

export const WorkSection = ({ experiences }: WorkSectionProps) => {
  return (
    <section className="py-20 border-t border-border relative" id="experience">
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Expérience
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Mon parcours professionnel</h2>
        <p className="text-muted-foreground">Plus de 3 ans d'expérience à créer des solutions digitales innovantes</p>
      </motion.div>
      
      <div className="space-y-12">
        {experiences.map((work, index) => (
          <motion.div 
            key={index} 
            className="group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-border via-primary/50 to-border md:left-48" />
            <motion.div 
              className="absolute left-0 top-0 w-px bg-gradient-to-b from-primary via-primary to-transparent md:left-48 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.8 }}
            />
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
              <div className="flex-shrink-0 md:w-48 text-sm text-muted-foreground relative">
                <div className="sticky top-24">
                  <div className="font-medium">{formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : "Présent"}</div>
                  <motion.div 
                    className="absolute -right-4 top-2 w-2 h-2 rounded-full bg-primary ring-4 ring-background hidden md:block"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 transition-all hover:border-foreground/20 hover:shadow-lg">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {work.position}
                  </h3>
                  {work.url ? (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      {work.name}
                      <span className="text-xs">↗</span>
                    </a>
                  ) : (
                    <span className="text-muted-foreground">
                      {work.name}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {work.location_type} • {work.location}
                  </p>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {work.summary}
                </p>
                
                {work.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Responsabilités</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {work.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-foreground/50">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {work.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
