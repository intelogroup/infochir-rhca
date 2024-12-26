import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const FooterLogo = () => {
  return (
    <div className="space-y-6">
      <Link to="/" className="group flex items-center space-x-3">
        <div className="relative h-13 w-13 overflow-hidden rounded-xl"> // Increased from h-10 w-10
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
    </div>
  );
};