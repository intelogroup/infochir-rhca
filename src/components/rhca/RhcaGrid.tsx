import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { VolumeCard } from "./VolumeCard";
import { filterVolumes, sortVolumes, groupVolumesByYear } from "./utils/volumeFilters";
import { mockVolumes } from "./data/mockVolumes";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import type { RhcaVolume } from "./types";
import { SORT_OPTIONS, type SortOption } from "@/types/sortOptions";

interface RhcaGridProps {
  viewMode?: "grid" | "table";
}

const RhcaGridContent = ({ viewMode = "grid" }: RhcaGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const filteredVolumes = useMemo(() => {
    return filterVolumes(mockVolumes, searchTerm);
  }, [searchTerm]);

  const sortedVolumes = useMemo(() => {
    return sortVolumes(filteredVolumes, sortBy);
  }, [filteredVolumes, sortBy]);

  const groupedVolumes = useMemo(() => {
    return groupVolumesByYear(sortedVolumes);
  }, [sortedVolumes]);

  // Get years array and sort in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(groupedVolumes)
      .map(Number)
      .sort((a, b) => b - a);
  }, [groupedVolumes]);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={SORT_OPTIONS}
      />
      
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