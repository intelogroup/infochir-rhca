import { motion, AnimatePresence } from "framer-motion";

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
        className="bg-destructive/10 p-4 rounded-lg"
      >
        <ul className="list-disc list-inside text-sm text-destructive">
          {Object.values(errors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};