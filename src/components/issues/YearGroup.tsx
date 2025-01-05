import { IssueCard } from "@/components/igm/IssueCard";
import type { Issue } from "@/components/igm/types";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};