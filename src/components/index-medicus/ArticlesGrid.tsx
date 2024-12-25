import { ArticleWithRelations } from "@/types/article";
import { ArticleCard } from "./ArticleCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ArticlesGridProps {
  articles: ArticleWithRelations[];
  isLoading?: boolean;
}

export const ArticlesGrid = ({ articles, isLoading = false }: ArticlesGridProps) => {
  // Validate articles prop
  if (!Array.isArray(articles)) {
    console.error("Articles must be an array");
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des articles.
        </AlertDescription>
      </Alert>
    );
  }

  // Handle empty state
  if (!isLoading && articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white/95 backdrop-blur-xs rounded-xl border border-gray-100">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun article trouvé
        </h3>
        <p className="text-gray-600">
          Essayez de modifier vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
        />
      ))}
    </div>
  );
};