
import * as React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectoryList } from "@/components/directory/DirectoryList";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Annuaire = () => {
  // Use with default path-based key
  useScrollToTop();

  // Improved staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    },
    exit: {
      opacity: 0,
      transition: { 
        duration: 0.2,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 } 
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <MainLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        <LazyMotion features={domAnimation}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[100px]">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-primary hover:text-primary-light mb-6"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <motion.div 
                variants={itemVariants}
                className="text-center mb-12 space-y-4"
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent mb-4">
                  Annuaire des Membres
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-gray-100/20 shadow-xl">
                  Liste des membres d'InfoChir/RHCA, comprenant les professionnels dévoués qui contribuent à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
                </p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <DirectoryList />
              </motion.div>
            </motion.div>
          </div>
        </LazyMotion>
      </div>
    </MainLayout>
  );
};

export default Annuaire;
