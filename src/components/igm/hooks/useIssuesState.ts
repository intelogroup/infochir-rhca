
import { useMemo, useCallback } from "react";
import type { Issue, SortOption } from "../types";
import { DateRange } from "react-day-picker";
import { isValidDate } from "../types";
import { 
  filterBySearchTerm, 
  filterByDateRange, 
  filterByCategories 
} from "../utils/issueFiltering";

interface IssuesStateOptions {
  searchTerm: string;
  sortBy: string;
  dateRange?: DateRange;
  selectedCategories: string[];
}

interface IssuesStateResult {
  sortedIssues: Issue[];
  issuesByYear: Record<number, Issue[]>;
  sortedYears: number[];
  availableCategories: string[];
}

export const useIssuesState = ({
  issues,
  searchTerm,
  sortBy,
  dateRange,
  selectedCategories
}: {
  issues: Issue[];
  searchTerm: string;
  sortBy: string;
  dateRange?: DateRange;
  selectedCategories: string[];
}): IssuesStateResult => {
  // Extract all unique categories
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    issues.forEach(issue => {
      issue.categories?.forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories).sort();
  }, [issues]);

  // Apply filters in sequence
  const filteredIssues = useMemo(() => {
    console.log("Filtering issues, count before:", issues.length);
    
    // Apply each filter in sequence
    let result = filterBySearchTerm(issues, searchTerm);
    console.log("After search filter:", result.length);
    
    result = filterByDateRange(result, dateRange?.from, dateRange?.to);
    console.log("After date range filter:", result.length);
    
    result = filterByCategories(result, selectedCategories);
    console.log("After category filter:", result.length);
    
    // Log years in filtered issues
    const yearCounts: Record<number, number> = {};
    result.forEach(issue => {
      const year = new Date(issue.date).getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    console.log("Year distribution in filtered issues:", yearCounts);
    
    return result;
  }, [issues, searchTerm, dateRange, selectedCategories]);

  // Memoize sorting
  const sortedIssues = useMemo(() => {
    const sorted = [...filteredIssues];
    
    const sortFunctions: Record<string, (a: Issue, b: Issue) => number> = {
      latest: (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      year: (a: Issue, b: Issue) => {
        const yearDiff = new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
        return yearDiff || new Date(b.date).getMonth() - new Date(a.date).getMonth();
      },
      downloads: (a: Issue, b: Issue) => (b.downloads || 0) - (a.downloads || 0),
      shares: (a: Issue, b: Issue) => (b.shares || 0) - (a.shares || 0),
    };

    sorted.sort(sortFunctions[sortBy] || sortFunctions.latest);
    return sorted;
  }, [filteredIssues, sortBy]);

  // Group by year with optimization
  const { issuesByYear, sortedYears } = useMemo(() => {
    const byYear: Record<number, Issue[]> = {};
    const years = new Set<number>();
    
    console.log("Grouping issues by year, count:", sortedIssues.length);
    
    for (const issue of sortedIssues) {
      try {
        const date = new Date(issue.date);
        if (!isValidDate(date)) {
          console.error(`Invalid date for issue ${issue.id}: ${issue.date}`);
          continue;
        }
        
        const year = date.getFullYear();
        console.log(`Issue ${issue.id} has date ${issue.date}, year: ${year}`);
        years.add(year);
        
        if (!byYear[year]) {
          byYear[year] = [];
        }
        byYear[year].push(issue);
      } catch (error) {
        console.error(`Error processing issue ${issue.id}:`, error);
      }
    }
    
    console.log("Years found:", Array.from(years));
    console.log("Issues by year:", byYear);
    
    return {
      issuesByYear: byYear,
      sortedYears: Array.from(years).sort((a, b) => b - a)
    };
  }, [sortedIssues]);

  return {
    sortedIssues,
    issuesByYear,
    sortedYears,
    availableCategories,
  };
};
