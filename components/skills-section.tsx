"use client";

import { motion } from "motion/react";
import {
  Code2,
  Palette,
  Database,
  GitBranch,
  Blocks,
  FileCode,
  Layers,
  Box,
  type LucideIcon,
} from "lucide-react";

interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

interface SkillsSectionProps {
  skills: Skill[];
}

const skillIcons: Record<string, LucideIcon> = {
  Figma: Palette,
  Gitlab: GitBranch,
  HTML: FileCode,
  CSS: Palette,
  JavaScript: Code2,
  Tailwind: Layers,
  TypeScript: Code2,
  Node: Box,
  MySQL: Database,
  Git: GitBranch,
  GitHub: GitBranch,
  "Next.js": Blocks,
  React: Blocks,
};

export const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const getSkillIcon = (skillName: string) => {
    const Icon = skillIcons[skillName] || Code2;
    return Icon;
  };

  return (
    <section className="py-20 border-t border-border relative" id="skills">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb,0,0,0),0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <motion.div 
        className="mb-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Compétences
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Technologies & Outils</h2>
        <p className="text-muted-foreground">Les technologies que je maîtrise pour donner vie à vos projets</p>
      </motion.div>
      
      <div className="flex flex-wrap gap-3 relative z-10">
        {skills.map((skill, index) => {
          const Icon = getSkillIcon(skill.name);
          
          return (
            <motion.div
              key={index}
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:bg-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <Icon className="w-4 h-4 text-primary relative z-10" />
              <span className="font-medium text-sm relative z-10">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
