
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const FoundersEmpty = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Alert className="mb-6">
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Aucune information sur les fondateurs n'est disponible pour le moment.
        </AlertDescription>
      </Alert>
    </div>
  );
};
