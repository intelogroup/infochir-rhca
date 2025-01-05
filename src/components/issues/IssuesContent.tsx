import { YearGroup } from "./YearGroup";
import { IssuesTable } from "./IssuesTable";
import type { Issue } from "./types";

interface IssuesContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading: boolean;
}

export const IssuesContent = ({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
  isLoading,
}: IssuesContentProps) => {
  if (isLoading) {
    return <div className="p-4">Chargement des articles...</div>;
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-4">
        {sortedYears.map((year) => (
          <YearGroup 
            key={year}
            year={year}
            issues={issuesByYear[year]}
          />
        ))}
      </div>
    );
  }

  return <IssuesTable issues={sortedIssues} />;
};