
import { MainLayout } from "@/components/layouts/MainLayout";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { motion } from "framer-motion";
import { BookOpen, Target, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[30px]">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-primary hover:text-primary-light"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
                À propos d'INFOCHIR/RHCA
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                INFOCHIR/RHCA est une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie en Haïti.
                Notre mission est de faciliter le partage des connaissances médicales et de promouvoir la recherche scientifique.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Notre Mission</h3>
                  <p className="text-gray-600">
                    Créer et publier des revues scientifiques pour documenter et partager les connaissances 
                    médicales en chirurgie et anesthésiologie.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Nos Objectifs</h3>
                  <p className="text-gray-600">
                    Offrir une plateforme d'expression pour les professionnels de la santé et 
                    contribuer à l'avancement de la médecine en Haïti.
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Notre Communauté</h3>
                  <p className="text-gray-600">
                    Rassembler éducateurs, praticiens et chercheurs pour créer une communauté 
                    médicale forte et collaborative.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* About RHCA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-primary mb-6">
                  La Revue Haïtienne de Chirurgie et d'Anesthésiologie (RHCA)
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                  Fondée en 2011, RHCA est une publication trimestrielle qui vise à documenter 
                  et partager les expériences, recherches et innovations dans le domaine de la 
                  chirurgie et de l'anesthésiologie en Haïti.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-primary mb-4">RHCA</h3>
                    <p className="text-gray-600 mb-3">Publication trimestrielle</p>
                    <p className="text-sm text-gray-500">
                      Articles médicaux, diaporamas, dossiers et informations scientifiques
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-primary mb-4">IGM</h3>
                    <p className="text-gray-600 mb-3">L'Info Gazette Médicale</p>
                    <p className="text-sm text-gray-500">
                      Publication mensuelle lancée en décembre 2020
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <FoundersSection />
        <SponsorsSection />
      </div>
    </MainLayout>
  );
};

export default About;
