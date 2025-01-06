import { IssueCard } from "@/components/igm/IssueCard";
import { Calendar } from "lucide-react";
import type { Issue } from "@/components/igm/types";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div 
      className="space-y-4 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
      role="region"
      aria-labelledby={`year-heading-${year}`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 
            id={`year-heading-${year}`}
            className="text-lg sm:text-xl font-semibold text-gray-900"
          >
            {year}
          </h2>
        </div>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {issues.length} numéro{issues.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div 
        className="grid grid-cols-1 gap-4"
        role="list"
        aria-label={`Issues de ${year}`}
      >
        {issues.map((issue) => (
          <IssueCard 
            key={`${year}-${issue.id}`}
            issue={issue}
          />
        ))}
      </div>
    </div>
  );
};