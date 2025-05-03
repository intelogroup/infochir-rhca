
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FormErrorsProps {
  errors: { [key: string]: string };
}

export const FormErrors = ({ errors }: FormErrorsProps) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-destructive/10 p-4 rounded-lg mb-6"
      >
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-semibold">Veuillez corriger les erreurs suivantes:</h3>
        </div>
        <ul className="list-disc list-inside text-sm text-destructive">
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};
