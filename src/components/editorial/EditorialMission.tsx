import { motion } from "framer-motion";
import { Target, CheckCircle, BookOpen } from "lucide-react";

export const EditorialMission = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mb-16"
  >
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <Target className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre Mission</h3>
        <p className="text-gray-600">
          Assurer la qualité scientifique et la pertinence des articles publiés 
          dans l'Info Gazette Médicale.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CheckCircle className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre Engagement</h3>
        <p className="text-gray-600">
          Maintenir les plus hauts standards de rigueur scientifique et d'éthique 
          dans la publication médicale.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <BookOpen className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre Vision</h3>
        <p className="text-gray-600">
          Contribuer à l'avancement des connaissances médicales en Haïti et 
          promouvoir l'excellence en recherche.
        </p>
      </div>
    </div>
  </motion.div>
);