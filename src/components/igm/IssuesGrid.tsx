import { useState } from "react";
import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssuesGridContent } from "./components/IssuesGridContent";
import { useIssuesState } from "./hooks/useIssuesState";
import { mockIssues } from "./data/mockIssues";
import { SORT_OPTIONS, type SortOption } from "./constants/sortOptions";
import { Skeleton } from "@/components/ui/skeleton";

interface IssuesGridProps {
  viewMode?: "grid" | "table";
}

export const IssuesGrid = ({ viewMode = "grid" }: IssuesGridProps) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SearchAndSort
          searchTerm=""
          sortBy={sortBy}
          onSearch={() => {}}
          onSort={() => {}}
          sortOptions={SORT_OPTIONS}
          disabled={true}
        />
        
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-24" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-[200px] w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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