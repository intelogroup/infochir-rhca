import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticTable } from "./DiagnosticTable";
import { DiagnosticCase } from "./types";

interface DiagnosticGridContentProps {
  view: "grid" | "table";
  filteredCases: DiagnosticCase[];
  relatedCases?: DiagnosticCase[];
}

export const DiagnosticGridContent = ({ 
  view, 
  filteredCases,
  relatedCases = []
}: DiagnosticGridContentProps) => {
  if (filteredCases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun cas trouvé</p>
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((diagnosticCase) => (
          <DiagnosticCard
            key={diagnosticCase.id}
            diagnosticCase={diagnosticCase}
          />
        ))}
      </div>
    );
  }

  return <DiagnosticTable cases={filteredCases} />;
};