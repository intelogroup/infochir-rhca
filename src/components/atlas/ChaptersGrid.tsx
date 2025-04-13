
import React from 'react';
import { AtlasCard } from './AtlasCard';
import { useAtlasArticles } from './hooks/useAtlasArticles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ChaptersGrid = () => {
  const { data: chapters, isLoading, error } = useAtlasArticles();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" className="text-secondary" />
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
    <div>
      <h2 className="text-2xl font-bold mb-6">Chapitres disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <AtlasCard key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
};

export default ChaptersGrid;
