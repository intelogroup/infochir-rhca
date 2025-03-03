
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
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="flex items-start gap-3">
          <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3">Notre Mission</h3>
            <p className="text-gray-600">
              Assurer la qualité scientifique et la pertinence des articles publiés 
              dans l'Info Gazette Médicale.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3">Notre Engagement</h3>
            <p className="text-gray-600">
              Maintenir les plus hauts standards de rigueur scientifique et d'éthique 
              dans la publication médicale.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
        <div className="flex items-start gap-3">
          <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3">Notre Vision</h3>
            <p className="text-gray-600">
              Contribuer à l'avancement des connaissances médicales en Haïti et 
              promouvoir l'excellence en recherche.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
