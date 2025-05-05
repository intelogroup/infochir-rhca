
import { YearGroupList } from "./YearGroupList";
import { IssuesTable } from "@/components/issues/IssuesTable";
import { FileText, Search } from "lucide-react";
import type { Issue } from "../types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-10">
        <LoadingSpinner variant="primary" size="lg" text="Chargement des numéros..." />
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
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {viewMode === "grid" ? (
        <ScrollArea className="h-[700px] pr-4">
          <YearGroupList 
            issuesByYear={issuesByYear}
            sortedYears={sortedYears}
          />
          
          {hasMore && (
            <div className="flex justify-center mt-6 pb-4">
              <Button 
                variant="outline"
                onClick={onLoadMore}
                className="gap-2"
              >
                Charger plus
              </Button>
            </div>
          )}
        </ScrollArea>
      ) : (
        <>
          <IssuesTable issues={sortedIssues} />
          
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline"
                onClick={onLoadMore}
                className="gap-2"
              >
                Charger plus
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
