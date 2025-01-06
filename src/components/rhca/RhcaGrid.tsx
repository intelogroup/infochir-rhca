import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { VolumeCard } from "./VolumeCard";
import { filterVolumes, sortVolumes, groupVolumesByYear } from "./utils/volumeFilters";
import { mockVolumes } from "./data/mockVolumes";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import type { RhcaVolume } from "./types";
import { SORT_OPTIONS, type SortOption } from "@/types/sortOptions";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RhcaGridProps {
  viewMode?: "grid" | "table";
}

const SPECIALTIES = [
  "Cardiologie",
  "Neurochirurgie",
  "Pédiatrie",
  "Orthopédie",
  "Chirurgie plastique",
  "Général"
];

const RhcaGridContent = ({ viewMode = "grid" }: RhcaGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const filteredVolumes = useMemo(() => {
    let filtered = filterVolumes(mockVolumes, searchTerm);
    if (selectedSpecialty) {
      filtered = filtered.filter(volume => 
        volume.description?.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        volume.articles.some(article => 
          article.tags?.some(tag => 
            tag.toLowerCase().includes(selectedSpecialty.toLowerCase())
          )
        )
      );
    }
    return filtered;
  }, [searchTerm, selectedSpecialty]);

  const sortedVolumes = useMemo(() => {
    return sortVolumes(filteredVolumes, sortBy);
  }, [filteredVolumes, sortBy]);

  const groupedVolumes = useMemo(() => {
    return groupVolumesByYear(sortedVolumes);
  }, [sortedVolumes]);

  const sortedYears = useMemo(() => {
    return Object.keys(groupedVolumes)
      .map(Number)
      .sort((a, b) => b - a);
  }, [groupedVolumes]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchAndSort
          searchTerm={searchTerm}
          sortBy={sortBy}
          onSearch={setSearchTerm}
          onSort={setSortBy}
          sortOptions={SORT_OPTIONS}
        />
        
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex space-x-2 p-4">
            <Badge
              variant={selectedSpecialty === "" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSpecialty("")}
            >
              Tous
            </Badge>
            {SPECIALTIES.map((specialty) => (
              <Badge
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="space-y-12">
        {sortedYears.map((year) => (
          <div key={year} className="space-y-6">
            <h2 
              className="text-primary font-bold"
              style={{ fontSize: 'clamp(1.5rem, 1.3rem + 1vw, 2rem)' }}
            >
              {year}
            </h2>
            <div 
              className="grid gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
                gridAutoRows: "1fr"
              }}
            >
              {groupedVolumes[year].map((volume) => (
                <ErrorBoundary key={volume.id}>
                  <VolumeCard volume={volume} />
                </ErrorBoundary>
              ))}
            </div>
          </div>
        ))}

        {sortedYears.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun volume trouvé pour votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const RhcaGrid = (props: RhcaGridProps) => {
  return (
    <ErrorBoundary>
      <RhcaGridContent {...props} />
    </ErrorBoundary>
  );
};