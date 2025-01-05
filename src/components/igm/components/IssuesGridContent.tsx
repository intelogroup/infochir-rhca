import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { LoadingState } from "./LoadingState";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
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
      <ErrorBoundary>
        <YearGroupList
          issuesByYear={issuesByYear}
          sortedYears={sortedYears}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <IssuesTable issues={sortedIssues} />
    </ErrorBoundary>
  );
};