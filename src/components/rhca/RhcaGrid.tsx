import { useState, useMemo } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { VolumeCard } from "./VolumeCard";
import { filterVolumes, sortVolumes } from "./utils/volumeFilters";
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
      
      <div className="grid gap-6 md:grid-cols-2">
        {sortedVolumes.map((volume) => (
          <VolumeCard
            key={volume.id}
            volume={volume}
          />
        ))}
      </div>
    </div>
  );
};