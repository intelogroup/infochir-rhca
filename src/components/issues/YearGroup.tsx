import { IssueCard } from "@/components/igm/IssueCard";
import type { Issue } from "@/components/igm/types";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{year}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 sm:gap-6">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};