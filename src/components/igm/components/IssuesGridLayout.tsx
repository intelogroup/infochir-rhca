import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssuesGridContent } from "./IssuesGridContent";
import { useIssuesState } from "../hooks/useIssuesState";
import { SORT_OPTIONS, type SortOption } from "../constants/sortOptions";

interface IssuesGridLayoutProps {
  viewMode?: "grid" | "table";
}

export const IssuesGridLayout = ({ viewMode = "grid" }: IssuesGridLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const { sortedIssues, issuesByYear, sortedYears } = useIssuesState(
    mockIssues,
    searchTerm,
    sortBy
  );

  return (
    <div className="space-y-6">
      <SearchAndSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
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