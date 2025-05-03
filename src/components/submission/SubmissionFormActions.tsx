
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";

interface SubmissionFormActionsProps {
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
  onSaveDraft: () => void;
}

export const SubmissionFormActions: React.FC<SubmissionFormActionsProps> = ({
  isSubmitting,
  isValid,
  hasErrors,
  onSaveDraft
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button 
        type="button" 
        variant="outline"
        className="gap-2"
        disabled={isSubmitting}
        onClick={onSaveDraft}
      >
        <Save className="h-4 w-4" />
        Sauvegarder comme brouillon
      </Button>
      <Button 
        type="submit"
        className="gap-2"
        disabled={isSubmitting || !isValid || hasErrors}
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Envoi en cours..." : "Soumettre l'article"}
      </Button>
    </div>
  );
};
