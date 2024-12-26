import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";

interface Founder {
  name: string;
  title: string;
  role: string;
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm border-gray-200/50">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <UserRound className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{founder.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{founder.title}</p>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {founder.role}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Note : Dr G. Kernisan, membre fondateur de regretté mémoire, a été remplacé par le Dr Jean-Robert Antoine.</p>
        </motion.div>
      </div>
    </section>
  );
};