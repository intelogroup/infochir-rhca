import { useState } from "react";
import { DiagnosticSearch } from "./DiagnosticSearch";
import { ViewToggle } from "./ViewToggle";
import { DiagnosticGridContent } from "./DiagnosticGridContent";
import { mockCases, specialties } from "./mockData";

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Toutes les spécialités");
  const [view, setView] = useState<"grid" | "table">("grid");

  const filteredCases = mockCases.filter(item => {
    const matchesSearch = (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSpecialty = selectedSpecialty === "Toutes les spécialités" || item.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <DiagnosticSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          specialties={specialties}
        />
        <ViewToggle view={view} setView={setView} />
      </div>

      <DiagnosticGridContent 
        view={view} 
        filteredCases={filteredCases} 
      />
    </div>
  );
};