
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('CarouselErrorState');

interface CarouselErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

export const CarouselErrorState = ({ error, onRetry }: CarouselErrorStateProps) => {
  logger.error('Error fetching carousel data:', error);
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Une erreur est survenue lors du chargement des articles.
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
