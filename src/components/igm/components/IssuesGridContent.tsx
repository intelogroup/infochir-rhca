import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { FileText, Search, Loader2, InboxX } from "lucide-react";
import type { Issue } from "../types";
import { LoadingState } from "./LoadingState";

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
    return <LoadingState />;
  }

  if (sortedIssues.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-xl border border-gray-100 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="bg-secondary/10 p-4 rounded-full mb-6">
          <InboxX className="h-8 w-8 text-secondary-foreground/70" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Aucun numéro trouvé</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Nous n'avons trouvé aucun numéro correspondant à vos critères de recherche. 
          Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          <FileText className="h-5 w-5 text-primary/70" aria-hidden="true" />
          <span className="text-sm text-gray-600">
            {sortedIssues.length} numéro{sortedIssues.length !== 1 ? 's' : ''} trouvé{sortedIssues.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <YearGroup 
              key={year}
              year={year}
              issues={issuesByYear[year]}
            />
          ))}
        </div>
      </div>
    );
  }

  return <IssuesTable issues={sortedIssues} />;
};