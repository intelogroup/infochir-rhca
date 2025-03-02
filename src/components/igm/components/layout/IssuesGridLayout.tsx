
import { useState } from "react";
import IssuesSearch from "@/components/igm/IssuesSearch";
import { IssuesGridContent } from "@/components/igm/components/IssuesGridContent";
import { useIssuesState } from "@/components/igm/hooks/useIssuesState";
import { sortOptions } from "@/components/igm/constants/sortOptions";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SortOption } from "@/components/igm/types";
import { DateRange } from "react-day-picker";
import { useIGMIssues } from "@/components/igm/hooks/useIGMIssues";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface IssuesGridLayoutProps {
  viewMode?: "grid" | "table";
}

export const IssuesGridLayout = ({ viewMode = "grid" }: IssuesGridLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
  const isMobile = useIsMobile();

  const { data: issues = [], isLoading, error, isError } = useIGMIssues();

  const { 
    sortedIssues, 
    issuesByYear, 
    sortedYears,
    availableCategories 
  } = useIssuesState(issues, {
    searchTerm,
    sortBy,
    dateRange,
    selectedCategories,
  });

  const loadMore = () => {
    setDisplayCount(prev => prev + (isMobile ? 3 : 6));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Chargement des numéros...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement des numéros.
          {error instanceof Error ? ` ${error.message}` : ''}
        </AlertDescription>
      </Alert>
    );
  }

  if (issues.length === 0) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Aucun numéro trouvé</AlertTitle>
        <AlertDescription>
          Aucun numéro n'a été trouvé. Veuillez réessayer ultérieurement.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IssuesSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          dateRange={dateRange}
          setDateRange={setDateRange}
          sortOptions={sortOptions}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          availableCategories={availableCategories}
        />
      </motion.div>
      
      <div className="px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <IssuesGridContent
            viewMode={viewMode}
            sortedIssues={sortedIssues.slice(0, displayCount)}
            issuesByYear={issuesByYear}
            sortedYears={sortedYears}
            isLoading={isLoading}
            onLoadMore={loadMore}
            hasMore={displayCount < sortedIssues.length}
          />
        </motion.div>
      </div>
    </div>
  );
};
