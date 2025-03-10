
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface StatsErrorProps {
  onRetry: () => void;
}

export const StatsError: React.FC<StatsErrorProps> = ({ onRetry }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-label="Erreur de chargement">
      <div className="container mx-auto px-4">
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Une erreur est survenue lors du chargement des statistiques.
              </AlertDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </Button>
        </Alert>
      </div>
    </section>
  );
};
