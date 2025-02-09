
import { IssuesSearch } from "../IssuesSearch";
import { IssuesGridContent } from "@/components/igm/components/IssuesGridContent";
import { useIssuesState } from "../../hooks/useIssuesState";
import { SORT_OPTIONS } from "../../constants/sortOptions";
import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SortOption } from "@/types/sortOptions";
import { DateRange } from "react-day-picker";
import { useIGMIssues } from "../../hooks/useIGMIssues";

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

  const { data: issues = [], isLoading } = useIGMIssues();

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
          sortOptions={[...SORT_OPTIONS]}
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
