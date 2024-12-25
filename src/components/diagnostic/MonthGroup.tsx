import { DiagnosticCard } from "./DiagnosticCard";
import { MonthGroup as MonthGroupType } from "./types";

interface MonthGroupProps {
  monthGroup: MonthGroupType;
  monthName: string;
}

export const MonthGroup = ({ monthGroup, monthName }: MonthGroupProps) => {
  return (
    <div key={monthGroup.month}>
      <h3 className="text-lg font-semibold mb-3 text-gray-600">
        {monthName}
      </h3>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
        {monthGroup.cases.map((diagnosticCase) => (
          <DiagnosticCard
            key={diagnosticCase.id}
            diagnosticCase={diagnosticCase}
          />
        ))}
      </div>
    </div>
  );
};