"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import { motion } from "motion/react";
import { BackgroundPattern } from "./background-pattern";
import { ContactDropdown } from "./contact-dropdown";
import { Button } from "./ui/button";

interface HeroSectionProps {
  name: string;
  label: string;
  summary: string;
  email: string;
  phone: string;
  image: string;
  profiles: Array<{
    network: string;
    username: string;
    url: string;
  }>;
}

export const HeroSection = ({ name, label, summary, email, phone, image, profiles }: HeroSectionProps) => {
  return (
    <section className="relative py-20 md:py-32">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative z-10">
        <motion.div 
          className="relative group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-zinc-300 to-neutral-400 dark:from-slate-600 dark:via-zinc-500 dark:to-neutral-600 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl">
            <Image
              src={image}
              alt={name}
              width={160}
              height={160}
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
        
        <div className="flex-1 flex flex-col gap-8 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <motion.div 
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground justify-center md:justify-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Disponible pour de nouveaux projets
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {name}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground font-medium leading-normal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {label}
            </motion.p>
          </div>
          
          <motion.p 
            className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {summary}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 items-center justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ContactDropdown email={email} phone={phone} variant="default" />
            
            <Button
              asChild
              variant="outline"
            >
              <Link href="#projects">
                <Download className="w-4 h-4" />
                Voir mes réalisations
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-6 items-center justify-center md:justify-start pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.network}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Link
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="font-medium">{profile.network}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
