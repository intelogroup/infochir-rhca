import { useState, useMemo } from "react";
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

  return (
    <div className="max-w-7xl mx-auto scale-[0.85] origin-top">
      <DiagnosticSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
      />

      <div className="space-y-8">
        {filteredAndGroupedCases.map((yearGroup) => (
          <YearGroupComponent
            key={yearGroup.year}
            yearGroup={yearGroup}
            monthNames={monthNames}
          />
        ))}
      </div>
    </div>
  );
};