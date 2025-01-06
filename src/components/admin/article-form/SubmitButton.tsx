import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SubmitButtonProps {
  isLoading: boolean;
  isEditing: boolean;
}

export const SubmitButton = ({ isLoading, isEditing }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      disabled={isLoading}
      className="min-w-[200px] relative overflow-hidden group"
    >
      <motion.span
        initial={false}
        animate={{ x: isLoading ? 20 : 0, opacity: isLoading ? 0 : 1 }}
        className="inline-block"
      >
        {isEditing ? "Mettre à jour" : "Enregistrer"}
      </motion.span>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </Button>
  );
};