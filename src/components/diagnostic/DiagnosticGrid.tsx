import { useState, useMemo } from "react";
import { DiagnosticSearch } from "./DiagnosticSearch";
import { ViewToggle } from "./ViewToggle";
import { DiagnosticGridContent } from "./DiagnosticGridContent";
import { mockCases, specialties } from "./mockData";
import { toast } from "@/hooks/use-toast";

export const DiagnosticGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Toutes les spécialités");
  const [view, setView] = useState<"grid" | "table">("grid");

  // Memoize filtered cases to prevent unnecessary recalculations
  const filteredCases = useMemo(() => {
    const filtered = mockCases.filter(item => {
      const matchesSearch = (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSpecialty = selectedSpecialty === "Toutes les spécialités" || item.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });

    if (filtered.length === 0 && searchTerm !== "") {
      toast({
        title: "Aucun résultat",
        description: "Essayez de modifier vos critères de recherche",
        variant: "destructive",
      });
    }

    return filtered;
  }, [searchTerm, selectedSpecialty]);

  // Get related cases based on specialty
  const relatedCases = useMemo(() => {
    if (selectedSpecialty === "Toutes les spécialités") return [];
    return mockCases
      .filter(item => 
        item.specialty === selectedSpecialty && 
        !filteredCases.includes(item)
      )
      .slice(0, 3);
  }, [selectedSpecialty, filteredCases]);

  return (
    <div className="space-y-6">
      <DiagnosticSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        specialties={specialties}
      />

      <DiagnosticGridContent 
        view={view} 
        filteredCases={filteredCases}
        relatedCases={relatedCases}
      />

      <ViewToggle view={view} setView={setView} />

      {relatedCases.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Cas similaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedCases.map((relatedCase) => (
              <div 
                key={relatedCase.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
              >
                <h4 className="font-medium">{relatedCase.title}</h4>
                <p className="text-sm text-gray-500 mt-2">{relatedCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};