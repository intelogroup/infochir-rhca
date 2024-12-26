import { motion } from "framer-motion";
import { FooterSection, quickLinks, resources } from "./layouts/FooterSection";
import { FooterLogo } from "./footer/FooterLogo";
import { SocialLinks } from "./footer/SocialLinks";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200/50">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FooterLogo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FooterSection title="Liens rapides" links={quickLinks} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FooterSection title="Ressources" links={resources} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SocialLinks />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-200/50"
        >
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} InfoChir. Tous droits réservés.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};