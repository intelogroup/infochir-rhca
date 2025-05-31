
import React from "react";
import { RhcaGrid } from "./RhcaGrid";
import { RhcaTable } from "./RhcaTable";
import { useRHCAArticles } from "./hooks/useRHCAArticles";
import { MobileOptimizedContainer } from "@/components/mobile/MobileOptimizedContainer";
import { useIsMobile } from "@/hooks/use-mobile";

export const RhcaContent: React.FC = () => {
  const isMobile = useIsMobile();

  const {
    articles,
    loading: isLoading,
    error,
    refetch
  } = useRHCAArticles();

  const handleRefresh = async () => {
    refetch();
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

    if (!isMobile) {
      return <RhcaTable articles={articles} searchQuery="" onSearchChange={() => {}} />;
    }
    
    return <RhcaGrid articles={articles} viewMode="grid" searchQuery="" onSearchChange={() => {}} />;
  };

  return (
    <MobileOptimizedContainer 
      onRefresh={handleRefresh}
      className="space-y-6"
    >
      {renderContent()}
    </MobileOptimizedContainer>
  );
};
