import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssuesGridContent } from "./components/IssuesGridContent";
import { useIssuesState } from "./hooks/useIssuesState";
import { mockIssues } from "./data/mockIssues";
import { SORT_OPTIONS, type SortOption } from "./constants/sortOptions";

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const {
    sortedIssues,
    issuesByYear,
    sortedYears,
  } = useIssuesState(mockIssues, searchTerm, sortBy);

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={SORT_OPTIONS}
      />
      
      <IssuesGridContent
        viewMode={viewMode}
        sortedIssues={sortedIssues}
        issuesByYear={issuesByYear}
        sortedYears={sortedYears}
      />
    </div>
  );
};