import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssuesGridContent } from "./components/IssuesGridContent";
import { useIssuesState } from "./hooks/useIssuesState";
import { mockIssues } from "./data/mockIssues";
import { SORT_OPTIONS, type SortOption } from "./constants/sortOptions";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

const IssuesGridContent = ({ viewMode }: IssuesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [isLoading, setIsLoading] = useState(true);

  const {
    sortedIssues,
    issuesByYear,
    sortedYears,
  } = useIssuesState(mockIssues, searchTerm, sortBy);

  // Simulate loading for demo purposes
  setTimeout(() => setIsLoading(false), 1000);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={SORT_OPTIONS}
        disabled={isLoading}
      />
      
      <IssuesGridContent
        viewMode={viewMode}
        sortedIssues={sortedIssues}
        issuesByYear={issuesByYear}
        sortedYears={sortedYears}
        isLoading={isLoading}
      />
    </div>
  );
};

export const IssuesGrid = (props: IssuesGridProps) => {
  return (
    <ErrorBoundary>
      <IssuesGridContent {...props} />
    </ErrorBoundary>
  );
};