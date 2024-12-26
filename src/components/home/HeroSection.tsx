import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8"
          >
            Bienvenue sur{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InfoChir
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            La plateforme de référence pour la recherche médicale et les connaissances chirurgicales en Haïti.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/rhca">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explorer RHCA
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="#submit">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Soumettre votre article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};