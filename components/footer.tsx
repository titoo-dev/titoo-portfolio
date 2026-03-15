"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { ContactDropdown } from "./contact-dropdown";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const email = "dev.titosy@gmail.com";
  const phone = "+261388032274";
  
  return (
    <footer className="py-12 border-t border-border">
      <div className="flex flex-col gap-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-2">Travaillons ensemble</h3>
            <p className="text-sm text-muted-foreground">
              Vous avez un projet en tête ? Discutons-en !
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ContactDropdown email={email} phone={phone} variant="default" />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p>© {currentYear} Titosy Manankasina. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span> à Madagascar
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
