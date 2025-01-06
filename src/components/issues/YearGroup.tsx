import { IssueCard } from "@/components/igm/IssueCard";
import type { Issue } from "@/components/igm/types";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div 
      className="space-y-4"
      role="region"
      aria-labelledby={`year-heading-${year}`}
    >
      <h2 
        id={`year-heading-${year}`}
        className="text-lg sm:text-xl font-semibold text-gray-900 px-2 sm:px-4"
      >
        {year}
      </h2>
      <div 
        className="grid grid-cols-1 gap-4 px-2 sm:px-4"
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