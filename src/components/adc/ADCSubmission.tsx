import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
export const ADCSubmission = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Veuillez entrer un terme de recherche");
      return;
    }
    toast.info("Recherche en cours...");
    // Search functionality will be implemented here
  };
  return <div className="bg-gradient-to-b from-secondary/5 to-white py-24">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <motion.form initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }} onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            
          </div>
        </motion.form>

        <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{
            scale: 0.8,
            opacity: 0
          }} whileInView={{
            scale: 1,
            opacity: 1
          }} transition={{
            type: "spring",
            duration: 0.5
          }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-8">
              <FileText className="h-8 w-8 text-secondary" />
            </motion.div>
            
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="text-3xl font-bold text-secondary mb-6">
              Contribuez à l'Atlas
            </motion.h2>
            
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="text-xl text-gray-600 mb-12">
              Partagez vos cas cliniques et contribuez à l'enrichissement de notre base de connaissances collective.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className="space-y-6">
                <div className="p-6 bg-secondary/5 rounded-xl transition-all duration-300 hover:bg-secondary/10">
                  <BookOpen className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Soumettre un cas
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Partagez vos observations et expériences cliniques avec la communauté médicale.
                  </p>
                  <Link to="/submission">
                    <Button className="w-full group transition-all duration-300">
                      Soumettre maintenant
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className="space-y-6">
                <div className="p-6 bg-secondary/5 rounded-xl transition-all duration-300 hover:bg-secondary/10">
                  <FileText className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Instructions aux auteurs
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Consultez nos directives pour la préparation et la soumission de vos cas cliniques.
                  </p>
                  <Link to="/rhca/directives">
                    <Button variant="outline" className="w-full group transition-all duration-300">
                      Voir les directives
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>;
};