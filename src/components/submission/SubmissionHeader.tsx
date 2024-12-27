import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export const SubmissionHeader = () => {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Soumettre un Article
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Veuillez remplir ce formulaire pour soumettre votre article à la RHCA ou à l'IGM
        </p>
      </motion.div>
    </div>
  );
};