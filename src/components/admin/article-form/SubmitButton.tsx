
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  isEditing?: boolean;
}

export const SubmitButton = ({ isLoading, isEditing = false }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      size="lg" 
      disabled={isLoading}
      className="w-full sm:w-auto min-w-[200px]"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditing ? "Mise à jour..." : "Création..."}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Mettre à jour l'article" : "Créer l'article"}
        </>
      )}
    </Button>
  );
};
