
import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { FileText, Search, Loader2 } from "lucide-react";
import type { Issue } from "../types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface IssuesGridContentProps {
  viewMode: "grid" | "table";
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const IssuesGridContent = ({
  viewMode,
  sortedIssues,
  issuesByYear,
  sortedYears,
  isLoading,
  onLoadMore,
  hasMore,
}: IssuesGridContentProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-100">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-900">Chargement des numéros...</p>
        <p className="text-sm text-gray-500 mt-1">Veuillez patienter</p>
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

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {viewMode === "grid" ? (
        <YearGroupList 
          issuesByYear={issuesByYear}
          sortedYears={sortedYears}
        />
      ) : (
        <IssuesTable issues={sortedIssues} />
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline"
            onClick={onLoadMore}
            className="gap-2"
          >
            Charger plus
          </Button>
        </div>
      )}
    </motion.div>
  );
};
