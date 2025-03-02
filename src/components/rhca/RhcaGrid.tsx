import React, { useState, useEffect } from 'react';
import { useRHCAArticles } from './hooks/useRHCAArticles';
import { RhcaCard } from './RhcaCard';
import { RhcaTable } from './RhcaTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewGrid, List } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Keep the component as a named export for internal use
export const RhcaGrid: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const { articles, loading, error } = useRHCAArticles();
  
  useEffect(() => {
    console.log('[RhcaGrid] Articles loaded:', articles.length);
    if (articles.length > 0) {
      console.log('[RhcaGrid] Sample article:', articles[0]);
    }
  }, [articles]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Chargement des articles RHCA...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement des articles RHCA.
          {error.message && ` ${error.message}`}
        </AlertDescription>
      </Alert>
    );
  }
  
  const renderContent = () => {
    if (viewMode === 'grid') {
      if (articles.length === 0) {
        return (
          <Alert className="mb-6">
            <AlertTitle>Aucun article trouvé</AlertTitle>
            <AlertDescription>
              Aucun article n'a été trouvé dans la base de données.
            </AlertDescription>
          </Alert>
        );
      }
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <RhcaCard key={article.id} article={article} />
          ))}
        </div>
      );
    } else {
      return <RhcaTable articles={articles} />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
          className="w-10 h-10 p-0"
        >
          <ViewGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
          className="w-10 h-10 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      
      {renderContent()}
    </div>
  );
};

// Also export as default export for direct imports
export default RhcaGrid;
