import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { VolumeCard } from "./VolumeCard";
import { filterVolumes, sortVolumes, groupVolumesByYear } from "./utils/volumeFilters";
import { mockVolumes } from "./data/mockVolumes";
import type { RhcaVolume } from "./types";

interface RhcaGridProps {
  viewMode?: "grid" | "table";
}

export const RhcaGrid = ({ viewMode = "grid" }: RhcaGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const filteredVolumes = useMemo(() => {
    return filterVolumes(mockVolumes, searchTerm);
  }, [searchTerm]);

  const sortedVolumes = useMemo(() => {
    return sortVolumes(filteredVolumes, sortBy);
  }, [filteredVolumes, sortBy]);

  const groupedVolumes = useMemo(() => {
    return groupVolumesByYear(sortedVolumes);
  }, [sortedVolumes]);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={[
          { value: "latest", label: "Plus récents" },
          { value: "year", label: "Année" },
          { value: "downloads", label: "Téléchargements" },
          { value: "shares", label: "Partages" },
        ]}
      />
      
      <div className="space-y-12">
        {Object.entries(groupedVolumes).map(([year, volumes]) => (
          <div key={year} className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">{year}</h2>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-6"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))"
              }}
            >
              {volumes.map((volume) => (
                <VolumeCard
                  key={volume.id}
                  volume={volume}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};