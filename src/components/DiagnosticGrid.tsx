import { useState, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import { DiagnosticSearch } from "./diagnostic/DiagnosticSearch";
import { YearGroup as YearGroupComponent } from "./diagnostic/YearGroup";
import { diagnosticCases } from "./diagnostic/data";
import { useFilteredCases } from "./diagnostic/hooks/useFilteredCases";

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const specialties = useMemo(() => {
    return Array.from(new Set(diagnosticCases.map((c) => c.specialty))).sort();
  }, []);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const filteredAndGroupedCases = useFilteredCases(
    diagnosticCases,
    searchTerm,
    selectedSpecialty
  );

  // Calculate dynamic height based on viewport
  const calculateListHeight = () => {
    const viewportHeight = window.innerHeight;
    const topOffset = 200; // Account for header, search, and padding
    return viewportHeight - topOffset;
  };

  const [listHeight, setListHeight] = useState(calculateListHeight());

  // Update height on window resize
  useCallback(() => {
    const handleResize = () => {
      setListHeight(calculateListHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const yearGroup = filteredAndGroupedCases[index];
    return (
      <div style={style}>
        <YearGroupComponent
          yearGroup={yearGroup}
          monthNames={monthNames}
        />
      </div>
    );
  }, [filteredAndGroupedCases, monthNames]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <DiagnosticSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
      />

      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-xl bg-white/95 backdrop-blur-xs p-6 border border-gray-100">
        <List
          height={listHeight}
          itemCount={filteredAndGroupedCases.length}
          itemSize={650}
          width="100%"
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
          overscanCount={2}
        >
          {Row}
        </List>
      </div>
    </div>
  );
};