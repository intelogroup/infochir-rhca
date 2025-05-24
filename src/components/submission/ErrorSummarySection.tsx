
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorSummarySectionProps {
  errors: Record<string, string>;
  hasUserInteracted: boolean;
  onDismiss?: () => void;
}

export const ErrorSummarySection = ({ 
  errors, 
  hasUserInteracted, 
  onDismiss 
}: ErrorSummarySectionProps) => {
  const errorCount = Object.keys(errors).length;
  
  // Don't show if no errors or user hasn't interacted
  if (errorCount === 0 || !hasUserInteracted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sticky bottom-4 z-50"
      >
        <Card className="border-destructive/50 bg-destructive/5 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive text-lg">
              <AlertTriangle className="h-5 w-5" />
              {errorCount === 1 
                ? "1 erreur à corriger" 
                : `${errorCount} erreurs à corriger`}
            </CardTitle>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-destructive/70 hover:text-destructive transition-colors"
                aria-label="Fermer le résumé des erreurs"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.entries(errors).map(([field, message], index) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  <span className="text-destructive/90">{message}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-destructive/20">
              <p className="text-xs text-destructive/70">
                Veuillez corriger ces erreurs avant de soumettre votre article.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
