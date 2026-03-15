"use client";

import { motion } from "motion/react";

interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
}

interface EducationSectionProps {
  education: Education[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "short" });
};

export const EducationSection = ({ education }: EducationSectionProps) => {
  return (
    <section className="py-20 border-t border-border relative" id="education">
      <div className="absolute top-1/2 -right-24 w-48 h-48 bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Éducation
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Formation académique</h2>
        <p className="text-muted-foreground">Mon parcours éducatif en ingénierie logicielle</p>
      </motion.div>
      
      <div className="space-y-8">
        {education.map((edu, index) => (
          <motion.div 
            key={index} 
            className="group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
              <div className="flex-shrink-0 md:w-48 text-sm text-muted-foreground">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xl font-semibold mb-1">
                    {edu.studyType} en {edu.area}
                  </h3>
                  <a
                    href={edu.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {edu.institution}
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
