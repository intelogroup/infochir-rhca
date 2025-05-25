
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FormErrorsProps {
  errors: { [key: string]: string };
}

export const FormErrors = ({ errors }: FormErrorsProps) => {
  const errorCount = Object.keys(errors).length;
  
  if (errorCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-6"
      >
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-semibold text-red-800">
            Instructions de soumission
          </h3>
        </div>
        <ul className="list-disc list-inside text-sm text-red-700 space-y-1.5">
          {Object.values(errors).map((error, index) => (
            <li key={index} className="animate-pulse-once">
              {error}
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};
