
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoundersErrorProps {
  error: Error;
}

export const FoundersError = ({ error }: FoundersErrorProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement des fondateurs: {error.message}
        </AlertDescription>
      </Alert>
      <div className="text-center">
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
};
