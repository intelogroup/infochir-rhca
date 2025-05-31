
import React from "react";
import { RhcaGrid } from "./RhcaGrid";
import { RhcaTable } from "./RhcaTable";
import { useArticlesState } from "./hooks/useArticlesState";
import { useRHCAArticles } from "./hooks/useRHCAArticles";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { useIsMobile } from "@/hooks/use-mobile";

export const RhcaContent: React.FC = () => {
  const {
    searchTerm,
    selectedCategories,
    selectedVolumes,
    selectedYears,
    sortBy,
    sortOrder,
    viewMode,
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE
  } = useArticlesState();

  const isMobile = useIsMobile();

  const {
    data: articlesData,
    isLoading,
    error,
    refetch
  } = useRHCAArticles({
    searchTerm,
    selectedCategories,
    selectedVolumes,
    selectedYears,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-gray-600">Chargement des articles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Erreur lors du chargement des articles</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const articles = articlesData?.articles || [];
  const totalCount = articlesData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const renderContent = () => {
    if (articles.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun article trouvé</p>
          <p className="text-gray-400 text-sm mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      );
    }

    if (viewMode === 'table' && !isMobile) {
      return <RhcaTable articles={articles} />;
    }
    
    return <RhcaGrid articles={articles} />;
  };

  return (
    <MobileOptimizedContainer 
      onRefresh={handleRefresh}
      className="space-y-6"
    >
      {renderContent()}
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </MobileOptimizedContainer>
  );
};
