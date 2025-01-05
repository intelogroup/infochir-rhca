import { YearGroupList } from "./YearGroupList";
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
      <YearGroupList
        issuesByYear={issuesByYear}
        sortedYears={sortedYears}
      />
    );
  }

  return <IssuesTable issues={sortedIssues} />;
};