import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { FileText, Search } from "lucide-react";
import type { Issue } from "../types";
import { IssueCardSkeleton } from "./IssueCardSkeleton";

interface IssuesGridContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading: boolean;
}

export const IssuesGridContent = ({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
  isLoading,
}: IssuesGridContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((year) => (
          <div key={year} className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/5 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <IssueCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedIssues.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="bg-secondary/10 p-4 rounded-full mb-4">
          <Search className="h-8 w-8 text-secondary-foreground/70" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun numéro trouvé</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Nous n'avons trouvé aucun numéro correspondant à vos critères de recherche. 
          Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
        </p>
      </div>
    );
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