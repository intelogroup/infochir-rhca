import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import type { Issue } from "../types";

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
      <div 
        className="p-4"
        role="status"
        aria-live="polite"
      >
        Chargement des articles...
      </div>
    );
  }

  if (sortedIssues.length === 0) {
    return (
      <div 
        className="p-4 text-center text-gray-500"
        role="status"
        aria-live="polite"
      >
        Aucun numéro trouvé
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

  return (
    <IssuesTable 
      issues={sortedIssues}
      aria-label="Liste des numéros en format tableau"
    />
  );
};