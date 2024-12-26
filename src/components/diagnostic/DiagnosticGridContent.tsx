import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticTable } from "./DiagnosticTable";
import { DiagnosticCase } from "./types";

interface DiagnosticGridContentProps {
  view: "grid" | "table";
  filteredCases: DiagnosticCase[];
}

export const DiagnosticGridContent = ({ view, filteredCases }: DiagnosticGridContentProps) => {
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