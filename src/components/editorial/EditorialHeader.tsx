
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const EditorialHeader = () => (
  <div className="mb-16">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden mb-12"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
      <div className="flex items-start gap-4">
        <Users className="h-10 w-10 text-primary mt-1 flex-shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-primary mb-4">Comité Éditorial</h1>
          <p className="text-lg text-gray-600">
            Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs, 
            garantissant la qualité et la pertinence des publications de l'Info Gazette Médicale.
          </p>
        </div>
      </div>
    </motion.div>
  </div>
);
