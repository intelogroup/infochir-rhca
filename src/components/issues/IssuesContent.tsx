import { YearGroup } from "./YearGroup";
import { IssuesTable } from "./IssuesTable";
import { FileText, Search } from "lucide-react";
import type { Issue } from "./types";

interface IssuesContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading: boolean;
}

export const IssuesContent = ({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
  isLoading,
}: IssuesContentProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span>Chargement des articles...</span>
        </div>
      </div>
    );
  }

  if (sortedIssues.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-gray-100 text-center"
        role="status"
        aria-live="polite"
      >
        <Search className="h-12 w-12 text-gray-300 mb-3" aria-hidden="true" />
        <p className="text-lg font-medium text-gray-900 mb-1">Aucun numéro trouvé</p>
        <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-4">
          <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span className="text-sm text-gray-500">
            {sortedIssues.length} numéro{sortedIssues.length !== 1 ? 's' : ''} trouvé{sortedIssues.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-6">
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