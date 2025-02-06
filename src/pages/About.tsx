import { MainLayout } from "@/components/layouts/MainLayout";
import { FoundersSection } from "@/components/home/FoundersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { motion } from "framer-motion";
import { BookOpen, Target, Users, Award, ArrowLeft } from "lucide-react";
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

        <section 
          className="relative overflow-hidden py-8 sm:py-12 md:py-16 lg:py-24"
          aria-label="Introduction"
          tabIndex={0}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4 md:mb-6 px-3 sm:px-4">
                À propos d'INFOCHIR/RHCA
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed px-3 sm:px-4 md:px-6">
                INFOCHIR/RHCA est une plateforme dédiée à l'avancement des connaissances en chirurgie et anesthésiologie.
                Notre mission est de faciliter le partage des connaissances médicales et de promouvoir la recherche scientifique.
              </p>
            </motion.div>
          </div>
        </section>

        <section 
          className="py-6 sm:py-8 md:py-12 bg-white"
          aria-label="Notre mission et valeurs"
          tabIndex={0}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              role="list"
              aria-label="Liste des valeurs"
            >
              {[
                {
                  icon: Target,
                  title: "Notre Mission",
                  description: "Faciliter l'accès et le partage des connaissances médicales entre professionnels de santé."
                },
                {
                  icon: BookOpen,
                  title: "Innovation",
                  description: "Promouvoir l'innovation et la recherche en chirurgie et anesthésiologie."
                },
                {
                  icon: Users,
                  title: "Formation Continue",
                  description: "Soutenir la formation continue des professionnels de santé."
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "Maintenir les plus hauts standards de qualité dans la publication médicale."
                }
              ].map((item, index) => (
                <div 
                  key={item.title}
                  className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 outline-none"
                  role="listitem"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.currentTarget.focus();
                    }
                  }}
                >
                  <item.icon 
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mb-3 sm:mb-4" 
                    aria-hidden="true"
                  />
                  <h3 
                    id={`mission-title-${index}`}
                    className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2"
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-800">
                    {item.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section 
          className="py-6 sm:py-8 md:py-12 bg-gradient-to-br from-gray-50 to-white"
          aria-label="Nos services"
          tabIndex={0}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary mb-4 sm:mb-6 md:mb-8">
                Nos Services
              </h2>
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
                role="list"
                aria-label="Liste des services"
              >
                {[
                  {
                    title: "Publications Scientifiques",
                    description: "Publication d'articles scientifiques revus par des pairs dans le domaine de la chirurgie et de l'anesthésiologie."
                  },
                  {
                    title: "Base de Données Médicale",
                    description: "Accès à une vaste collection de ressources médicales et de références bibliographiques."
                  }
                ].map((service, index) => (
                  <div 
                    key={service.title}
                    className="p-4 sm:p-5 md:p-6 rounded-2xl bg-white shadow-lg shadow-primary/5 hover:shadow-xl transition-all duration-300 border border-gray-100 focus-within:ring-2 focus-within:ring-primary/50 outline-none"
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.focus();
                      }
                    }}
                  >
                    <h3 
                      id={`service-title-${index}`}
                      className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3"
                    >
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <FoundersSection />
        
        <SponsorsSection />
      </div>
    </MainLayout>
  );
};

export default About;
