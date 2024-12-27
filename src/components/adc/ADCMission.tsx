import { motion } from "framer-motion";
import { BookOpen, Users, Target, Search, Globe, Award } from "lucide-react";

export const ADCMission = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Ressource Complète",
      description: "Une base de données exhaustive de cas cliniques et de diagnostics chirurgicaux pour enrichir votre pratique."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Une plateforme collaborative permettant le partage d'expériences et de connaissances entre professionnels."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Un engagement constant vers l'excellence dans la pratique chirurgicale et le diagnostic médical."
    },
    {
      icon: Search,
      title: "Recherche Avancée",
      description: "Des outils de recherche sophistiqués pour trouver rapidement les informations pertinentes."
    },
    {
      icon: Globe,
      title: "Portée Internationale",
      description: "Une ressource accessible aux professionnels de santé du monde entier."
    },
    {
      icon: Award,
      title: "Qualité Certifiée",
      description: "Des contenus validés par des experts reconnus dans leur domaine."
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-secondary mb-4">Notre Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fournir aux professionnels de santé les outils et ressources nécessaires pour exceller dans leur pratique quotidienne.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};