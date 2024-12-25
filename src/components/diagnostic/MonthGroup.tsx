import { memo } from "react";
import { DiagnosticCard } from "./DiagnosticCard";
import { MonthGroup as MonthGroupType } from "./types";

interface MonthGroupProps {
  monthGroup: MonthGroupType;
  monthName: string;
}

export const MonthGroup = memo(({ monthGroup, monthName }: MonthGroupProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {monthName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {monthGroup.cases.map((diagnosticCase) => (
          <DiagnosticCard
            key={diagnosticCase.id}
            diagnosticCase={diagnosticCase}
          />
        ))}
      </div>
    </div>
  );
});

MonthGroup.displayName = "MonthGroup";