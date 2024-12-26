import { Link } from "react-router-dom";
import { FooterSection, quickLinks, resources, socialLinks } from "./layouts/FooterSection";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-gray-200/50">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Link to="/" className="group flex items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                <img 
                  src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
                  alt="Info Chir Logo"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl font-bold">
                INFOCHIR/RHCA
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Une plateforme de premier plan pour la recherche médicale et les connaissances chirurgicales en Haïti.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Link
                to="/donate"
                className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-primary hover:bg-primary/90 transition-colors duration-200 text-white"
              >
                Faire un don
                <Heart className="ml-2 h-4 w-4 text-secondary fill-secondary" />
              </Link>
            </motion.div>
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

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-900 mb-6">Nous suivre</h3>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={social.href}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
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