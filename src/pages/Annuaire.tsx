import { MainLayout } from "@/components/layouts/MainLayout";
import { DirectoryList } from "@/components/directory/DirectoryList";
import { motion } from "framer-motion";

const Annuaire = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            Annuaire des Membres
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Liste des membres d'InfoChir/RHCA, comprenant les professionnels dévoués qui contribuent à l'avancement de la chirurgie et de l'anesthésiologie en Haïti.
          </p>
        </motion.div>
        <DirectoryList />
      </div>
    </MainLayout>
  );
};

export default Annuaire;