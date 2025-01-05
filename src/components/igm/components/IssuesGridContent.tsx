import { YearGroup } from "@/components/issues/YearGroup";
import { IssuesTable } from "@/components/issues/IssuesTable";
import type { Issue } from "../types";

interface IssuesGridContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
}

export const IssuesGridContent = ({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
}: IssuesGridContentProps) => {
  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
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