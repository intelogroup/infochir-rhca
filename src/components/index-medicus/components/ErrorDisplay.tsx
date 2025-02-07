
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: Error;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
  <div className="space-y-4">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>
        Une erreur est survenue lors du chargement des articles. 
        {error.message}
      </AlertDescription>
    </Alert>
    <Button 
      onClick={() => window.location.reload()}
      variant="outline"
      className="mx-auto block"
    >
      Réessayer
    </Button>
  </div>
);
