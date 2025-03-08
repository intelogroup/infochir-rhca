
import { useCallback, useState } from "react";
import { ArticleGrid } from "./ArticleGrid";
import { GenericErrorBoundary } from "@/components/error-boundary/GenericErrorBoundary";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface ArticleGridWrapperProps {
  defaultViewMode?: "grid" | "table";
}

/**
 * Wrapper component for ArticleGrid that provides error handling and retry functionality
 */
export const ArticleGridWrapper = ({ defaultViewMode = "table" }: ArticleGridWrapperProps) => {
  const [key, setKey] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">(defaultViewMode);
  
  // Reset component with a new key
  const handleReset = useCallback(() => {
    setKey(prevKey => prevKey + 1);
    toast.success("Rafraîchissement des articles...");
  }, []);
  
  // Handle errors with a custom fallback renderer
  const handleError = useCallback((error: Error) => {
    console.error("ArticleGrid error:", error);
    
    // Show toast with error message
    toast.error("Erreur de chargement des articles", {
      description: "Un problème est survenu lors du chargement des articles",
      icon: <AlertCircle className="h-5 w-5 text-destructive" />,
    });
  }, []);
  
  return (
    <GenericErrorBoundary
      key={key}
      errorContext="IndexMedicus"
      onError={handleError}
      onReset={handleReset}
      showErrorToasts={true}
      maxResets={3}
      renderChildrenOnError={false}
      fallbackRenderer={({ error, resetErrorBoundary }) => (
        <div className="p-8 text-center">
          <div className="mb-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="mt-2 text-lg font-semibold">Erreur de chargement</h3>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
          
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}
    >
      <ArticleGrid key={key} viewMode={viewMode} />
    </GenericErrorBoundary>
  );
};
