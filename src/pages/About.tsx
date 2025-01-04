import { MainLayout } from "@/components/layouts/MainLayout";
import { Info, BookOpen, Users, History, Target, Newspaper, Building } from "lucide-react";
import { motion } from "framer-motion";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { FoundersSection } from "@/components/home/FoundersSection";
import { TooltipProvider } from "@/components/ui/tooltip";

const About = () => {
  return (
    <MainLayout>
      <TooltipProvider>
        <div className="bg-gradient-to-b from-primary/5 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl font-bold text-primary mb-6">À propos d'Info CHIR</h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-600">
                  Une institution dédiée à l'avancement de la chirurgie et de l'anesthésiologie en Haïti
                </p>
              </div>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-6">Constitution de l'organisation</h2>
                <p className="text-gray-600 mb-6">
                  Le groupe des sept (7) Membres Fondateurs s'est considéré comme le conseil d'administration 
                  et s'est distribué les rôles de coordonnateur, de coordonnateur adjoint, de rédacteur en chef, 
                  d'éditeur, de trésorier, de chargé de la communication et de membre.
                </p>
                <p className="text-gray-600">
                  Un comité de lecture critique composé de cinq (5) médecins a été adjoint à ce conseil. 
                  C'étaient les Drs Fréderic Barau Dejean, interniste, Claudine Jolicoeur, anesthésiologiste, 
                  Claude Paultre, urologue, Georges Beauvoir et Patrick Dupont, orthopédistes.
                </p>
              </div>
            </div>

            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-6">Production et Impact</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Production</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      <li>34 numéros de la RHCA publiés de 2011 à Mars 2021</li>
                      <li>Production de l'IGM débutée en Décembre 2020</li>
                      <li>Exposition permanente accessible au local de l'Institution</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Impact</h3>
                    <p className="text-gray-600">
                      La RHCA et l'IGM veulent s'implanter dans le milieu médical haïtien et même d'outremer 
                      pour contribuer à combler le vide de données médicales fiables du milieu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-6">Perspectives</h2>
                <p className="text-gray-600">
                  Info CHIR œuvre à ce que la RHCA particulièrement se range dans la liste des journaux 
                  scientifiques nationaux et internationaux. La RHCA et l'IGM souhaitent que d'autres revues 
                  voient leur éclosion pour compléter le panorama de l'actualité littéraire médicale en Haïti.
                </p>
              </div>
            </div>
          </div>
        </div>

        <FoundersSection />
        <NewsletterSection />
        <SponsorsSection />
      </TooltipProvider>
    </MainLayout>
  );
};

const sections = [
  {
    title: "Introduction",
    icon: History,
    content: "Fondé en 2011, Info CHIR est né de la vision collective de sept médecins haïtiens, répondant au besoin crucial d'un journal spécialisé en chirurgie et anesthésiologie en Haïti."
  },
  {
    title: "Mission",
    icon: Target,
    content: "Créer et publier La Revue Haïtienne de Chirurgie et d'Anesthésiologie (RHCA), un espace d'expression universitaire et hospitalier pour la communauté médicale."
  },
  {
    title: "Définition",
    icon: BookOpen,
    content: "La RHCA se veut un lieu d'expression universitaire et hospitalier chirurgical et anesthésiologiste, ouvert à tous les enseignants et praticiens souhaitant partager leurs connaissances."
  },
  {
    title: "Philosophie",
    icon: Info,
    content: "Documenter l'histoire de la chirurgie et de l'anesthésiologie haïtienne, tout en créant un pont entre les générations de praticiens et en valorisant l'expertise locale."
  },
  {
    title: "Objectifs",
    icon: Target,
    content: "Créer un espace pour documenter les activités chirurgicales et anesthésiologiques du pays, publier des séries de cas, partager des expériences et stimuler la recherche."
  },
  {
    title: "Structure",
    icon: Building,
    content: "Organisation à but non lucratif, dirigée par un conseil d'administration bénévole, publie la RHCA (trimestrielle) et l'IGM (mensuelle)."
  }
];

export default About;