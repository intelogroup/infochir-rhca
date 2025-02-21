
import { motion } from "framer-motion";
import { BookOpen, Award, Users, CheckCircle } from "lucide-react";

export const EditorialMission = () => {
  const missions = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Excellence Éditoriale",
      description: "Maintien des standards élevés dans la sélection et la révision des articles."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Innovation Scientifique",
      description: "Promotion de la recherche innovante et des avancées chirurgicales."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Collaboration",
      description: "Favorisation des échanges entre chercheurs et praticiens."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Rigueur Scientifique",
      description: "Application stricte des normes de publication internationale."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-16"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
        Notre Mission
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              {mission.icon}
              <h3 className="font-semibold text-gray-900">{mission.title}</h3>
              <p className="text-gray-600 text-sm">{mission.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
