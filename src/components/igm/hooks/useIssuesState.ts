
import { useMemo } from "react";
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
      try {
        const date = new Date(issue.date);
        if (isValidDate(date)) {
          const year = date.getFullYear();
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        } else {
          // Try to extract year from categories or ID
          const yearFromCategory = issue.categories?.find(cat => /^20\d{2}$/.test(cat));
          if (yearFromCategory) {
            const year = parseInt(yearFromCategory, 10);
            yearCounts[year] = (yearCounts[year] || 0) + 1;
          }
        }
      } catch (error) {
        console.error(`Error processing issue ${issue.id} date:`, error);
      }
    });
    console.log("Year distribution in filtered issues:", yearCounts);
    
    return result;
  }, [issues, searchTerm, dateRange, selectedCategories]);

  // Memoize sorting
  const sortedIssues = useMemo(() => {
    const sorted = [...filteredIssues];
    
    const sortFunctions: Record<string, (a: Issue, b: Issue) => number> = {
      latest: (a: Issue, b: Issue) => {
        try {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        } catch (e) {
          return 0;
        }
      },
      year: (a: Issue, b: Issue) => {
        try {
          const yearA = new Date(a.date).getFullYear();
          const yearB = new Date(b.date).getFullYear();
          const yearDiff = yearB - yearA;
          if (yearDiff !== 0) return yearDiff;
          return new Date(b.date).getMonth() - new Date(a.date).getMonth();
        } catch (e) {
          return 0;
        }
      },
      downloads: (a: Issue, b: Issue) => (b.downloads || 0) - (a.downloads || 0),
      shares: (a: Issue, b: Issue) => (b.shares || 0) - (a.shares || 0),
    };

    sorted.sort(sortFunctions[sortBy] || sortFunctions.latest);
    return sorted;
  }, [filteredIssues, sortBy]);

  // Group by year with improved error handling
  const { issuesByYear, sortedYears } = useMemo(() => {
    const byYear: Record<number, Issue[]> = {};
    const years = new Set<number>();
    
    console.log("Grouping issues by year, count:", sortedIssues.length);
    
    for (const issue of sortedIssues) {
      try {
        let year: number | null = null;
        
        // Try to get year from date
        if (issue.date) {
          const date = new Date(issue.date);
          if (isValidDate(date)) {
            year = date.getFullYear();
          }
        }
        
        // If date is invalid, try to extract year from categories
        if (year === null) {
          const yearFromCategory = issue.categories?.find(cat => /^20\d{2}$/.test(cat));
          if (yearFromCategory) {
            year = parseInt(yearFromCategory, 10);
          }
        }
        
        // If still no year, try to extract from volume or id
        if (year === null) {
          const matchFromId = issue.id.match(/\b(20\d{2})\b/);
          if (matchFromId) {
            year = parseInt(matchFromId[1], 10);
          } else if (issue.volume && /\d{4}/.test(issue.volume)) {
            const matchFromVolume = issue.volume.match(/\b(20\d{2})\b/);
            if (matchFromVolume) {
              year = parseInt(matchFromVolume[1], 10);
            }
          }
        }
        
        // Use year if found
        if (year !== null) {
          console.log(`Issue ${issue.id} has date ${issue.date}, year: ${year}`);
          years.add(year);
          
          if (!byYear[year]) {
            byYear[year] = [];
          }
          byYear[year].push(issue);
        } else {
          console.warn(`Could not determine year for issue ${issue.id}`);
        }
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
