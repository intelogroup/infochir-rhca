import { SearchAndSort } from "@/components/issues/SearchAndSort";
import { IssuesGridContent } from "./IssuesGridContent";
import { useIssuesState } from "../hooks/useIssuesState";
import { mockIssues } from "../data/mockIssues";
import { SORT_OPTIONS, type SortOption } from "../constants/sortOptions";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { motion } from "framer-motion";

interface IssuesGridLayoutProps {
  viewMode?: "grid" | "table";
}

export const IssuesGridLayout = ({ viewMode = "grid" }: IssuesGridLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    sortedIssues,
    issuesByYear,
    sortedYears,
    availableCategories,
  } = useIssuesState(mockIssues, {
    searchTerm,
    sortBy,
    dateRange,
    selectedCategories,
  });

  // Simulate loading for demo purposes
  setTimeout(() => setIsLoading(false), 1000);

  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-t-xl border-b border-gray-100 p-6 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SearchAndSort
          searchTerm={searchTerm}
          sortBy={sortBy}
          onSearch={setSearchTerm}
          onSort={setSortBy}
          sortOptions={SORT_OPTIONS}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          availableCategories={availableCategories}
          disabled={isLoading}
        />
      </motion.div>
      
      <div className="px-4">
        <IssuesGridContent
          viewMode={viewMode}
          sortedIssues={sortedIssues}
          issuesByYear={issuesByYear}
          sortedYears={sortedYears}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};