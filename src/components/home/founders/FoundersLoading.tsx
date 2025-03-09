
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const FoundersLoading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <LoadingSpinner 
        text="Chargement des membres fondateurs..." 
        variant="medical"
        size="lg"
      />
    </div>
  );
};
