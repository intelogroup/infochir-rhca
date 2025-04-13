
import React, { useState } from 'react';
import { atlasChapters } from './data/atlasChapters';
import { AtlasCard } from './AtlasCard';
import { SearchBar } from '@/components/shared/SearchBar';
import { useIsMobile } from '@/hooks/use-mobile';

const ChaptersGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  
  // Filter chapters based on search term
  const filteredChapters = atlasChapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Chapitres disponibles</h2>
          <p className="text-gray-600 mt-1">Consultez les recommandations cliniques par chapitre</p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Rechercher un chapitre..."
          />
        </div>
      </div>

      {filteredChapters.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">Aucun chapitre ne correspond à votre recherche.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-primary hover:underline"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <AtlasCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChaptersGrid;
