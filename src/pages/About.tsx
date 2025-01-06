import { MainLayout } from "@/components/layouts/MainLayout";
import { FoundersSection } from "@/components/home/FoundersSection";
import { motion } from "framer-motion";
import { BookOpen, Target, Users, Award } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-ocean bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
                À propos d'INFOCHIR/RHCA
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4 sm:px-6">
                INFOCHIR/RHCA est une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie.
                Notre mission est de faciliter le partage des connaissances médicales et de promouvoir la recherche scientifique.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Notre Mission</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Faciliter l'accès et le partage des connaissances médicales entre professionnels de santé.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Innovation</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Promouvoir l'innovation et la recherche en chirurgie et anesthésiologie.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Formation Continue</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Soutenir la formation continue des professionnels de santé.
                </p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Excellence</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600">
                  Maintenir les plus hauts standards de qualité dans la publication médicale.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary mb-6 sm:mb-8 md:mb-12">Nos Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white shadow-lg shadow-primary/5 hover:shadow-xl transition-shadow border border-gray-100">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Publications Scientifiques</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Publication d'articles scientifiques revus par des pairs dans le domaine de la chirurgie et de l'anesthésiologie.
                  </p>
                </div>
                <div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white shadow-lg shadow-primary/5 hover:shadow-xl transition-shadow border border-gray-100">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Base de Données Médicale</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Accès à une vaste collection de ressources médicales et de références bibliographiques.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founders Section */}
        <FoundersSection />
      </div>
    </MainLayout>
  );
};

export default About;