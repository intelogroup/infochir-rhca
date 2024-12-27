import { motion } from "framer-motion";
import { BookOpen, Users, Target } from "lucide-react";

export const ADCMission = () => {
  return (
    <div className="mt-16 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-secondary mb-8">Notre Mission</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Ressource Complète</h3>
            <p className="text-gray-600 text-sm">
              Une base de données exhaustive de cas cliniques et de diagnostics chirurgicaux pour enrichir votre pratique.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Collaboration</h3>
            <p className="text-gray-600 text-sm">
              Une plateforme collaborative permettant le partage d'expériences et de connaissances entre professionnels.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Excellence</h3>
            <p className="text-gray-600 text-sm">
              Un engagement constant vers l'excellence dans la pratique chirurgicale et le diagnostic médical.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};