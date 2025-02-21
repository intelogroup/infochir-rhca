import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const EditorialHeader = () => (
  <div className="mb-16">
    <Link to="/igm" className="inline-block mb-8">
      <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary-light">
        <ArrowLeft className="h-4 w-4" />
        Retour à IGM
      </Button>
    </Link>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <Users className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold text-primary">Comité Éditorial</h1>
      </div>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Notre comité éditorial est composé d'experts reconnus dans leurs domaines respectifs, 
        garantissant la qualité et la pertinence des publications de l'Info Gazette Médicale.
      </p>
    </motion.div>
  </div>
);