import { SearchAndSort } from "./issues/SearchAndSort";
import { IssuesContent } from "./issues/IssuesContent";
import { useIssuesState } from "./issues/hooks/useIssuesState";
import { mockIssues } from "./igm/data/mockIssues";
import type { SortOption } from "./issues/types";

const SORT_OPTIONS = [
  { value: "latest" as SortOption, label: "Plus récents" },
  { value: "year" as SortOption, label: "Par année" },
  { value: "downloads" as SortOption, label: "Téléchargements" },
  { value: "shares" as SortOption, label: "Partages" },
] as const;

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    isLoading,
    sortedIssues,
    issuesByYear,
    sortedYears,
  } = useIssuesState(mockIssues);

  return (
    <div className="space-y-4 px-4">
      <SearchAndSort
        searchTerm={searchTerm}
        sortBy={sortBy}
        onSearch={setSearchTerm}
        onSort={setSortBy}
        sortOptions={SORT_OPTIONS}
      />
      
      <IssuesContent
        viewMode={viewMode}
        sortedIssues={sortedIssues}
        issuesByYear={issuesByYear}
        sortedYears={sortedYears}
        isLoading={isLoading}
      />
    </div>
  );
};