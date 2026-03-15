"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github, ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Project {
  name: string;
  isActive: boolean;
  description: string;
  highlights: string[];
  url: string | null;
  github?: string | null;
  image?: string | null;
  images?: string[];
}

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <section className="py-20 border-t border-border relative overflow-hidden" id="projects">
      <div className="absolute top-1/4 -right-16 md:-right-32 w-64 h-64 bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-16 md:-left-32 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Portfolio
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Projets & Réalisations</h2>
        <p className="text-muted-foreground">Découvrez quelques-uns de mes projets récents et contributions</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="group relative rounded-2xl border border-border bg-card backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-full h-48 bg-muted overflow-hidden">
              {(() => {
                const imageList = project.images && project.images.length > 0 
                  ? project.images 
                  : project.image 
                    ? [project.image] 
                    : [];

                if (imageList.length === 0) {
                  return (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  );
                }

                if (imageList.length === 1) {
                  return (
                    <>
                      <Image
                        src={imageList[0]}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  );
                }

                return (
                  <Carousel className="w-full h-full" opts={{ loop: true }}>
                    <CarouselContent className="h-48">
                      {imageList.map((img, idx) => (
                        <CarouselItem key={idx} className="relative h-48">
                          <Image
                            src={img}
                            alt={`${project.name} - Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border-border" />
                    <CarouselNext className="right-2 size-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border-border" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Carousel>
                );
              })()}
              
              {project.isActive && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-green-500/90 text-white backdrop-blur-sm shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Actif
                  </span>
                </div>
              )}
              
              <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {project.url && (
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                )}
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
            
            <div className="p-6 flex flex-col gap-3 flex-1">
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>
              
              {project.highlights.length > 0 && (
                <ul className="space-y-1.5 text-xs text-muted-foreground flex-1">
                  {project.highlights.slice(0, 2).map((highlight, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="line-clamp-2">{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
