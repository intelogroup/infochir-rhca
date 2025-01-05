import { IssueCard } from "@/components/igm/IssueCard";
import type { Issue } from "@/components/igm/types";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-4">{year}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};