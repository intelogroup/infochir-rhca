
import React from "react";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubmissionFormActionsProps {
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
  onSaveDraft: () => void;
}

export const SubmissionFormActions: React.FC<SubmissionFormActionsProps> = ({
  isSubmitting,
  isValid,
  hasErrors
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button 
        type="button" 
        variant="outline"
        className="gap-2"
        disabled={isSubmitting}
        onClick={handleCancel}
      >
        <X className="h-4 w-4" />
        Annuler
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
