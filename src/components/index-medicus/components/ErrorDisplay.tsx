
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  customMessage?: string;
}

export const ErrorDisplay = ({ error, onRetry, customMessage }: ErrorDisplayProps) => (
  <div className="space-y-4 mx-auto max-w-2xl mt-8">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>
        {customMessage || 'Une erreur est survenue lors du chargement des articles.'}{' '} 
        {error.message}
      </AlertDescription>
    </Alert>
    {onRetry && (
      <Button 
        onClick={onRetry}
        variant="outline"
        className="mx-auto block"
      >
        Réessayer
      </Button>
    )}
  </div>
);
