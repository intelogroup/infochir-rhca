
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const FooterLogo = () => {
  return (
    <div className="space-y-6">
      <Link to="/" className="group flex items-center space-x-3">
        <motion.div 
          className="relative h-12 w-12 overflow-hidden rounded-full shadow-md bg-white p-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <img 
            src="/lovable-uploads/cb9e38f1-3a2c-4310-a9eb-e65ee5c932a8.png"
            alt="Info Chir Logo"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </motion.div>
        <div className="flex flex-col">
          <span className="bg-gradient-to-r from-primary to-ocean bg-clip-text text-transparent text-xl font-bold transition-colors duration-300 group-hover:text-primary">
            INFOCHIR/RHCA
          </span>
          <span className="text-xs text-gray-500">Publication scientifique</span>
        </div>
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
          className="inline-flex items-center px-4 py-2 text-sm rounded-full bg-gradient-to-r from-primary to-ocean hover:from-ocean hover:to-primary transition-all duration-500 text-white shadow-sm hover:shadow-md"
        >
          Faire un don
          <Heart className="ml-2 h-4 w-4 text-white fill-white/20" />
        </Link>
      </motion.div>
    </div>
  );
};
