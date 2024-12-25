import { useState, useMemo } from "react";
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

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const yearGroup = filteredAndGroupedCases[index];
    return (
      <div style={style}>
        <YearGroupComponent
          key={yearGroup.year}
          yearGroup={yearGroup}
          monthNames={monthNames}
        />
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto scale-[0.85] origin-top">
      <DiagnosticSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
      />

      <List
        height={800} // Adjust this value based on your needs
        itemCount={filteredAndGroupedCases.length}
        itemSize={400} // Adjust this value based on your content
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};