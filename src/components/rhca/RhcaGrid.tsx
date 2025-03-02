
import React, { useState } from 'react';
import { useRHCAArticles } from './hooks/useRHCAArticles';
import { RhcaCard } from './RhcaCard';
import { RhcaTable } from './RhcaTable';
import { RhcaArticleList } from './RhcaArticleList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, ListFilter, Table as TableIcon } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const RhcaGrid: React.FC = () => {
  const { articles, loading, error } = useRHCAArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  
  // Extract unique volumes and specialties for filters
  const volumes = React.useMemo(() => {
    const uniqueVolumes = Array.from(new Set(articles.map(article => article.volume)));
    return uniqueVolumes.filter(Boolean).sort((a, b) => Number(b) - Number(a)); // Sort descending
  }, [articles]);
  
  const specialties = React.useMemo(() => {
    const uniqueSpecialties = Array.from(new Set(articles.map(article => article.specialty)));
    return uniqueSpecialties.filter(Boolean).sort();
  }, [articles]);
  
  // Filter articles based on search term, volume, and specialty
  const filteredArticles = React.useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.abstract?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVolume = !selectedVolume || article.volume === selectedVolume;
      const matchesSpecialty = !selectedSpecialty || article.specialty === selectedSpecialty;
      
      return matchesSearch && matchesVolume && matchesSpecialty;
    });
  }, [articles, searchTerm, selectedVolume, selectedSpecialty]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleVolumeChange = (volume: string | null) => {
    setSelectedVolume(volume === selectedVolume ? null : volume);
  };
  
  const handleSpecialtyChange = (specialty: string | null) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? null : specialty);
  };
  
  const handleClearFilters = () => {
    setSelectedVolume(null);
    setSelectedSpecialty(null);
    setSearchTerm('');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Erreur lors du chargement des articles: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des articles..."
            className="pl-9"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <ListFilter className="h-4 w-4 mr-2" />
                Filtres
                {(selectedVolume || selectedSpecialty) && (
                  <span className="ml-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center">
                    {(selectedVolume ? 1 : 0) + (selectedSpecialty ? 1 : 0)}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="font-medium text-sm p-2">Volume</div>
              {volumes.map(volume => (
                <DropdownMenuCheckboxItem
                  key={`vol-${volume}`}
                  checked={selectedVolume === volume}
                  onCheckedChange={() => handleVolumeChange(volume)}
                >
                  Volume {volume}
                </DropdownMenuCheckboxItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <div className="font-medium text-sm p-2">Spécialité</div>
              {specialties.map(specialty => (
                <DropdownMenuCheckboxItem
                  key={`spec-${specialty}`}
                  checked={selectedSpecialty === specialty}
                  onCheckedChange={() => handleSpecialtyChange(specialty)}
                >
                  {specialty}
                </DropdownMenuCheckboxItem>
              ))}
              
              {(selectedVolume || selectedSpecialty) && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={handleClearFilters}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <ListFilter className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode('table')}
              title="Vue tableau"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>Aucun article trouvé</p>
          {(searchTerm || selectedVolume || selectedSpecialty) && (
            <Button 
              variant="link" 
              onClick={handleClearFilters}
              className="mt-2"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <RhcaCard key={article.id} article={article} />
              ))}
            </div>
          )}
          
          {viewMode === 'list' && (
            <RhcaArticleList articles={filteredArticles} />
          )}
          
          {viewMode === 'table' && (
            <RhcaTable articles={filteredArticles} />
          )}
        </>
      )}
    </div>
  );
};

export default RhcaGrid;
