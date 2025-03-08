
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="gap-2 text-primary hover:text-primary-light"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      Retour
    </Button>
  );
};
