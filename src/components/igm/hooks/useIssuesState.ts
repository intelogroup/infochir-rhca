import { useMemo, useCallback } from "react";
import type { Issue } from "../types";
import type { SortOption } from "../constants/sortOptions";
import { isValidDate } from "../types";
import { DateRange } from "react-day-picker";

interface IssuesStateOptions {
  searchTerm: string;
  sortBy: SortOption;
  dateRange?: DateRange;
  selectedCategories?: string[];
}

export const useIssuesState = (
  issues: Issue[],
  {
    searchTerm,
    sortBy,
    dateRange,
    selectedCategories = [],
  }: IssuesStateOptions
) => {
  // Memoize the search filter function
  const filterBySearch = useCallback((issue: Issue): boolean => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    // Quick checks first
    if (issue.title.toLowerCase().includes(searchLower)) return true;
    if (issue.abstract.toLowerCase().includes(searchLower)) return true;
    
    // Only check articles if necessary
    return issue.articles.some(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.authors.some(author => author.toLowerCase().includes(searchLower)) ||
      article.abstract?.toLowerCase().includes(searchLower)
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

  // Memoize category filtering
  const filterByCategory = useCallback((issue: Issue): boolean => {
    if (selectedCategories.length === 0) return true;
    return issue.articles.some(article =>
      selectedCategories.some(category =>
        article.tags?.includes(category)
      )
    );
  }, [selectedCategories]);

  // Apply filters in sequence, from fastest to most expensive
  const filteredIssues = useMemo(() => {
    console.time('filtering');
    const filtered = issues.filter(issue => 
      filterByDate(issue) && 
      filterByCategory(issue) && 
      filterBySearch(issue)
    );
    console.timeEnd('filtering');
    return filtered;
  }, [issues, filterByDate, filterByCategory, filterBySearch]);

  // Memoize sorting
  const sortedIssues = useMemo(() => {
    console.time('sorting');
    const sorted = [...filteredIssues];
    
    switch (sortBy) {
      case "latest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "year":
        sorted.sort((a, b) => {
          const yearDiff = new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
          if (yearDiff === 0) {
            return new Date(b.date).getMonth() - new Date(a.date).getMonth();
          }
          return yearDiff;
        });
        break;
      case "downloads":
        sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case "shares":
        sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
        break;
    }
    console.timeEnd('sorting');
    return sorted;
  }, [filteredIssues, sortBy]);

  // Memoize year grouping
  const { issuesByYear, sortedYears } = useMemo(() => {
    console.time('grouping');
    const byYear: Record<number, Issue[]> = {};
    
    sortedIssues.forEach(issue => {
      const date = new Date(issue.date);
      if (!isValidDate(date)) return;
      
      const year = date.getFullYear();
      if (!byYear[year]) {
        byYear[year] = [];
      }
      byYear[year].push(issue);
    });

    const years = Object.keys(byYear)
      .map(Number)
      .sort((a, b) => b - a);
    
    console.timeEnd('grouping');
    return {
      issuesByYear: byYear,
      sortedYears: years
    };
  }, [sortedIssues]);

  // Memoize available categories
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    issues.forEach(issue => {
      issue.articles.forEach(article => {
        article.tags?.forEach(tag => categories.add(tag));
      });
    });
    return Array.from(categories).sort();
  }, [issues]);

  return {
    sortedIssues,
    issuesByYear,
    sortedYears,
    availableCategories,
  };
};