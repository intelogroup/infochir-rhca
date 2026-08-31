
import { YearGroup } from "./YearGroup";
import { IssuesTable } from "./IssuesTable";
import { FileText, Search, Loader2 } from "lucide-react";
import type { Issue } from "@/components/igm/types";  // Updated import to use IGM types

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
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-border">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-foreground">Chargement des numéros...</p>
        <p className="text-sm text-muted-foreground mt-1">Veuillez patienter</p>
      </div>
    );
  }

  if (sortedIssues.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-border text-center"
        role="status"
        aria-live="polite"
      >
        <div className="bg-secondary/10 p-4 rounded-full mb-4">
          <Search className="h-8 w-8 text-secondary-foreground/70" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Aucun numéro trouvé</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Nous n'avons trouvé aucun numéro correspondant à vos critères de recherche. 
          Essayez de modifier vos filtres ou d'effectuer une nouvelle recherche.
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-lg border border-border shadow-sm">
          <FileText className="h-5 w-5 text-primary/70" aria-hidden="true" />
          <span className="text-sm text-muted-foreground">
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
