import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

interface Founder {
  name: string;
  title: string;
  role: string;
  isDeceased?: boolean;
}

const founders: Founder[] = [
  {
    name: "Louis-Franck TELEMAQUE",
    title: "Chirurgien Général",
    role: "COORDONNATEUR"
  },
  {
    name: "Eunice DERIVOIS",
    title: "Chirurgien Général",
    role: "COORDONNATEUR ADJOINT"
  },
  {
    name: "Sosthène PIERRE",
    title: "Chirurgien Général",
    role: "RELATIONS PUBLIQUES"
  },
  {
    name: "Jean ALOUIDOR",
    title: "Pédiatre",
    role: "EDITEUR"
  },
  {
    name: "Geissly KERNISAN",
    title: "Chirurgien Général",
    role: "REDACTEUR",
    isDeceased: true
  },
  {
    name: "Jean-Robert ANTOINE",
    title: "Chirurgien Général",
    role: "REDACTEUR"
  },
  {
    name: "Jean-Marie EUSTACHE",
    title: "Chirurgien Général",
    role: "TRESORIER"
  },
  {
    name: "Denise FABIEN",
    title: "Anesthésiologiste",
    role: "MEMBRE"
  }
];

export const FoundersSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4"
          >
            Nos Membres Fondateurs
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            En 2011, sept médecins visionnaires se sont réunis pour créer Info CHIR, donnant naissance à une organisation dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`group hover:shadow-xl transition-all duration-300 backdrop-blur-sm border-gray-200/50 ${founder.isDeceased ? 'bg-gray-50/80' : 'bg-white/50 hover:bg-white/80'}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                      founder.isDeceased 
                        ? 'bg-gray-200/50 group-hover:bg-gray-200/70' 
                        : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      <UserRound className={`w-10 h-10 ${
                        founder.isDeceased ? 'text-gray-500' : 'text-primary'
                      }`} />
                    </div>
                    <h3 className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
                      founder.isDeceased ? 'text-gray-500' : 'text-gray-900 group-hover:text-primary'
                    }`}>
                      {founder.name}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      founder.isDeceased ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {founder.title}
                    </p>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      founder.isDeceased 
                        ? 'bg-gray-100 text-gray-500' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {founder.role}
                    </span>
                    {founder.isDeceased && (
                      <div className="mt-4 text-xs text-gray-500 italic">
                        In memoriam
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};