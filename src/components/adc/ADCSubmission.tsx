import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ADCSubmission = () => {
  return (
    <div className="bg-gradient-to-b from-secondary/5 to-white py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-8">
              <FileText className="h-8 w-8 text-secondary" />
            </div>
            
            <h2 className="text-3xl font-bold text-secondary mb-6">
              Contribuez à l'Atlas
            </h2>
            
            <p className="text-xl text-gray-600 mb-12">
              Partagez vos cas cliniques et contribuez à l'enrichissement de notre base de connaissances collective.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="p-6 bg-secondary/5 rounded-xl">
                  <BookOpen className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Soumettre un cas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Partagez vos observations et expériences cliniques avec la communauté médicale.
                  </p>
                  <Link to="/submission">
                    <Button className="w-full group">
                      Soumettre maintenant
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-secondary/5 rounded-xl">
                  <FileText className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instructions aux auteurs
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Consultez nos directives pour la préparation et la soumission de vos cas cliniques.
                  </p>
                  <Link to="/rhca/directives">
                    <Button variant="outline" className="w-full group">
                      Voir les directives
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};