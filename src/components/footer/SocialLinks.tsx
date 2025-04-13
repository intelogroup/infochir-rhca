
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { socialLinks } from "@/components/layouts/FooterSection";

export const SocialLinks = () => {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-6">Nous suivre</h3>
      <div className="flex flex-col space-y-6">
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <motion.div
              key={social.name}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 400
              }}
            >
              <Link
                to={social.href}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-ocean/10 text-primary hover:from-primary/20 hover:to-ocean/20 transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-100 shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Rejoignez-nous</h4>
          <p className="text-xs text-gray-500 mb-3">
            Suivez-nous sur les réseaux sociaux pour toutes les actualités
          </p>
          <Link to="/contact" className="inline-block w-full text-center bg-gradient-to-r from-primary to-ocean text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition-opacity">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
};
