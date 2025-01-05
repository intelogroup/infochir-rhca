import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssuesGridContent } from "./IssuesGridContent";
import { useIssuesState } from "../hooks/useIssuesState";
import { mockIssues } from "../data/mockIssues";
import { IGM_SORT_OPTIONS, type IGMSortOption } from "@/types/sort";
import { useState } from "react";

interface IssuesGridLayoutProps {
  viewMode?: "grid" | "table";
}

export const IssuesGridLayout = ({ viewMode = "grid" }: IssuesGridLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<IGMSortOption>("latest");
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
      <SearchAndSort<IGMSortOption>
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={IGM_SORT_OPTIONS}
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