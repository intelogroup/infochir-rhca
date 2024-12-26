import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const ADCSubmission = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-secondary mb-4">
        Soumission d'articles
      </h2>
      <p className="text-gray-600 mb-6">
        Nous accueillons les articles originaux, les revues systématiques, les cas cliniques 
        et les lettres à l'éditeur. Notre processus de révision par les pairs garantit la 
        qualité et la pertinence de chaque publication.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-secondary">Soumettre un manuscrit</h3>
          <Button className="w-full">
            Soumettre un article
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-secondary">Instructions aux auteurs</h3>
          <p className="text-sm text-gray-600">
            Consultez nos directives détaillées pour la préparation et la soumission de votre 
            manuscrit. Nous fournissons des modèles et des conseils pour assurer une présentation 
            optimale de vos travaux.
          </p>
          <Button variant="outline" className="w-full">
            Voir les directives
          </Button>
        </div>
      </div>
    </motion.div>
  );
};