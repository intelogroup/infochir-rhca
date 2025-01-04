import { motion } from "framer-motion";
import { BookText, Database, Search } from "lucide-react";

export const IndexMedicusHeader = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-lg mb-6">
            <img 
              src="/lovable-uploads/f2409464-47cf-4348-ada0-e328e86be01b.png"
              alt="Index Medicus Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-primary">
              Index Medicus
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Votre portail centralisé pour accéder à toutes les publications de RHCA, IGM et Atlas ADC.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md text-gray-600"
            >
              <BookText className="h-5 w-5 text-primary" />
              <span>Articles scientifiques</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md text-gray-600"
            >
              <Database className="h-5 w-5 text-primary" />
              <span>Base de données unifiée</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-md text-gray-600"
            >
              <Search className="h-5 w-5 text-primary" />
              <span>Recherche avancée</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};