
import React, { useState } from 'react';
import { AtlasCard } from './AtlasCard';
import { useAtlasArticles } from './hooks/useAtlasArticles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertTriangle, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/shared/SearchBar';
import { AtlasTableOfContents } from './AtlasTableOfContents';
import { Skeleton } from '@/components/ui/skeleton';

export const ChaptersGrid = () => {
  const { data: chapters, isLoading, error } = useAtlasArticles();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredChapters = React.useMemo(() => {
    if (!chapters || !searchTerm.trim()) return chapters;
    
    const query = searchTerm.toLowerCase().trim();
    return chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(query) ||
      (chapter.description && chapter.description.toLowerCase().includes(query)) ||
      (chapter.category && chapter.category.toLowerCase().includes(query)) ||
      (chapter.tags && chapter.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [chapters, searchTerm]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "table" : "grid");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-3 order-1">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-72" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 order-2">
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="text-xl font-semibold">Erreur de chargement</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Une erreur est survenue lors du chargement des chapitres. Veuillez réessayer ultérieurement.
        </p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="mt-4"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (!chapters || chapters.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold">Aucun chapitre disponible</h3>
        <p className="text-gray-600 mt-2">
          Les chapitres seront disponibles prochainement.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
      {/* Main content - Order 1 on desktop, Order 1 on mobile */}
      <div className="lg:col-span-3 order-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary">Chapitres disponibles</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 md:w-72">
              <SearchBar
                placeholder="Rechercher des chapitres..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              aria-label={viewMode === "grid" ? "Switch to table view" : "Switch to grid view"}
              className="sm:ml-2 h-9 px-2.5 py-1.5 border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4 text-gray-600" />
              ) : (
                <Grid2X2 className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <AtlasCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>
      
      {/* Sidebar - Order 2 on desktop, Order 2 on mobile */}
      <div className="lg:col-span-1 order-2 mb-6 lg:mb-0">
        <AtlasSidebar />
      </div>
    </div>
  );
};

const AtlasSidebar = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <AtlasTableOfContents />
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="font-semibold text-gray-900">Légende</h3>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Disponible</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>En préparation</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Non disponible</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChaptersGrid;
