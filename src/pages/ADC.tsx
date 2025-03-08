
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ADCHeader } from "@/components/adc/ADCHeader";
import { ADCMission } from "@/components/adc/ADCMission";
import { Button } from "@/components/ui/button";
import { AtlasCard } from "@/components/atlas/AtlasCard";
import { AtlasChapter, AtlasFilterStatus } from "@/components/atlas/types";
import { atlasCategories } from "@/components/atlas/data/atlasCategories";
import { getAtlasCategoryById } from "@/components/atlas/utils/chapterUtils";
import { useAtlasArticles } from "@/components/atlas/hooks/useAtlasArticles";
import { ADCSubmission } from "@/components/adc/ADCSubmission";
import { GenericErrorBoundary } from "@/components/error-boundary/GenericErrorBoundary";
import { createLogger } from "@/lib/error-logger";
import { toast } from "sonner";
import { Helmet } from "react-helmet";

const logger = createLogger('ADCPage');

// Filter controls component
const FilterControls = ({ 
  activeFilter, 
  onFilterChange 
}: { 
  activeFilter: AtlasFilterStatus; 
  onFilterChange: (filter: AtlasFilterStatus) => void; 
}) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button 
        variant={activeFilter === 'all' ? "default" : "outline"} 
        size="sm"
        onClick={() => onFilterChange('all')}
      >
        Tous
      </Button>
      <Button 
        variant={activeFilter === 'available' ? "default" : "outline"} 
        size="sm"
        onClick={() => onFilterChange('available')}
      >
        Disponibles
      </Button>
      <Button 
        variant={activeFilter === 'coming' ? "default" : "outline"} 
        size="sm"
        onClick={() => onFilterChange('coming')}
      >
        À venir
      </Button>
    </div>
  );
};

// Content loading component
const ChaptersGrid = React.memo(({ 
  chapters, 
  isLoading, 
  isError 
}: { 
  chapters: AtlasChapter[]; 
  isLoading: boolean; 
  isError: boolean; 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[280px] rounded-lg animate-pulse bg-gray-100"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600 mb-4">Une erreur est survenue lors du chargement des chapitres.</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg mb-4">Aucun chapitre ne correspond à ces critères.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {chapters.map((chapter) => {
        const category = getAtlasCategoryById(chapter.category || '', atlasCategories);
        return (
          <AtlasCard 
            key={chapter.id} 
            chapter={chapter} 
            category={category}
          />
        );
      })}
    </div>
  );
});

ChaptersGrid.displayName = 'ChaptersGrid';

// Main component
const ADC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<AtlasFilterStatus>('all');
  
  const { data: chapters = [], isLoading, error } = useAtlasArticles();
  
  // Filter chapters by status
  const filteredChapters = React.useMemo(() => {
    if (filter === 'all') return chapters;
    return chapters.filter(chapter => chapter.status === filter);
  }, [chapters, filter]);

  // Log an error if needed
  useEffect(() => {
    if (error) {
      logger.error('Error fetching ADC chapters:', error);
      toast.error('Erreur lors du chargement des chapitres', {
        description: 'Veuillez réessayer plus tard.'
      });
    }
  }, [error]);

  return (
    <GenericErrorBoundary errorContext="adc-page">
      <Helmet>
        <title>Atlas de Chirurgie | Infochir-RHCA</title>
        <meta name="description" content="Découvrez l'Atlas de Chirurgie avec des illustrations et des guides pratiques pour les professionnels de santé." />
      </Helmet>
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <ADCHeader />
        
        <section className="my-8">
          <ADCMission />
          
          <div className="flex justify-between items-center mb-4 mt-12">
            <h2 className="text-2xl font-bold">Chapitres et Fiches Techniques</h2>
            <Button variant="outline" onClick={() => navigate('/adc/submission')}>
              Soumettre un cas <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <FilterControls activeFilter={filter} onFilterChange={setFilter} />
          
          <ChaptersGrid 
            chapters={filteredChapters} 
            isLoading={isLoading} 
            isError={Boolean(error)} 
          />
        </section>
        
        <ADCSubmission />
      </div>
    </GenericErrorBoundary>
  );
};

export default ADC;
