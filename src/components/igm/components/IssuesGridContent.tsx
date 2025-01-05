import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { LoadingState } from "./LoadingState";
import type { Issue } from "../types";

interface IssuesGridContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading?: boolean;
}

export const IssuesGridContent = ({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
  isLoading = false
}: IssuesGridContentProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

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