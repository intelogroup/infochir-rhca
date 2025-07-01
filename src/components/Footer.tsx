
import { motion } from "framer-motion";
import { FooterSection, quickLinks, resources } from "./layouts/FooterSection";
import { FooterLogo } from "./footer/FooterLogo";
import { SocialLinks } from "./footer/SocialLinks";
import { NewsletterSubscribeFooter } from "./footer/NewsletterSubscribeFooter";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200/50">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-gray-100/80" />
      
      {/* Decorative elements */}
      <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-ocean/5 blur-2xl"></div>
      <div className="absolute right-10 bottom-10 h-40 w-40 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <FooterLogo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <FooterSection title="Liens rapides" links={quickLinks} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <FooterSection title="Ressources" links={resources} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <NewsletterSubscribeFooter />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} InfoChir. Tous droits réservés.
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-3">
            <a href="/privacy" className="text-xs text-gray-500 hover:text-primary transition-colors">
              Politique de confidentialité
            </a>
            <span className="text-gray-400">•</span>
            <a href="/terms" className="text-xs text-gray-500 hover:text-primary transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
