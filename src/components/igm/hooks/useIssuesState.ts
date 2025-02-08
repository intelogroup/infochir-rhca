
import { useMemo, useCallback } from "react";
import type { Issue } from "../types";
import type { SortOption } from "../constants/sortOptions";
import { isValidDate } from "../types";
import { DateRange } from "react-day-picker";

interface IssuesStateOptions {
  searchTerm: string;
  sortBy: SortOption;
  dateRange?: DateRange;
}

export const useIssuesState = (
  issues: Issue[],
  {
    searchTerm,
    sortBy,
    dateRange,
  }: IssuesStateOptions
) => {
  // Memoize the search filter function
  const filterBySearch = useCallback((issue: Issue): boolean => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const searchTerms = searchLower.split(' ').filter(Boolean);
    
    // Quick checks for main fields
    const mainFieldsMatch = 
      issue.title.toLowerCase().includes(searchLower) ||
      issue.abstract.toLowerCase().includes(searchLower);
    
    if (mainFieldsMatch) return true;
    
    // Check articles if necessary
    return issue.articles.some(article => 
      searchTerms.every(term => 
        article.title.toLowerCase().includes(term) ||
        article.authors.some(author => author.toLowerCase().includes(term)) ||
        article.abstract?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm]);

  // Memoize date filtering
  const filterByDate = useCallback((issue: Issue): boolean => {
    if (!dateRange?.from && !dateRange?.to) return true;
    
    const issueDate = new Date(issue.date);
    if (!isValidDate(issueDate)) return false;

    const isAfterStart = !dateRange.from || issueDate >= dateRange.from;
    const isBeforeEnd = !dateRange.to || issueDate <= dateRange.to;
    
    return isAfterStart && isBeforeEnd;
  }, [dateRange]);

  // Apply filters in sequence
  const filteredIssues = useMemo(() => {
    console.time('filtering');
    const filtered = issues.filter(issue => 
      filterByDate(issue) && 
      filterBySearch(issue)
    );
    console.timeEnd('filtering');
    return filtered;
  }, [issues, filterByDate, filterBySearch]);

  // Memoize sorting
  const sortedIssues = useMemo(() => {
    console.time('sorting');
    const sorted = [...filteredIssues];
    
    const sortFunctions = {
      latest: (a: Issue, b: Issue) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      year: (a: Issue, b: Issue) => {
        const yearDiff = new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
        return yearDiff || new Date(b.date).getMonth() - new Date(a.date).getMonth();
      },
      downloads: (a: Issue, b: Issue) => (b.downloads || 0) - (a.downloads || 0),
      shares: (a: Issue, b: Issue) => (b.shares || 0) - (a.shares || 0),
    };

    sorted.sort(sortFunctions[sortBy]);
    console.timeEnd('sorting');
    return sorted;
  }, [filteredIssues, sortBy]);

  // Group by year with optimization
  const { issuesByYear, sortedYears } = useMemo(() => {
    console.time('grouping');
    const byYear: Record<number, Issue[]> = {};
    const years = new Set<number>();
    
    for (const issue of sortedIssues) {
      const date = new Date(issue.date);
      if (!isValidDate(date)) continue;
      
      const year = date.getFullYear();
      years.add(year);
      
      if (!byYear[year]) {
        byYear[year] = [];
      }
      byYear[year].push(issue);
    }
    
    console.timeEnd('grouping');
    return {
      issuesByYear: byYear,
      sortedYears: Array.from(years).sort((a, b) => b - a)
    };
  }, [sortedIssues]);

  return {
    sortedIssues,
    issuesByYear,
    sortedYears,
  };
};
