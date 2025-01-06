import { useMemo } from "react";
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
  const filteredIssues = useMemo(() => {
    let filtered = issues;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((issue) => 
        issue.title.toLowerCase().includes(searchLower) ||
        issue.abstract.toLowerCase().includes(searchLower) ||
        issue.articles.some(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.authors.some(author => author.toLowerCase().includes(searchLower)) ||
          article.abstract?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply date range filter
    if (dateRange?.from || dateRange?.to) {
      filtered = filtered.filter(issue => {
        const issueDate = new Date(issue.date);
        if (!isValidDate(issueDate)) return false;

        const isAfterStart = !dateRange.from || issueDate >= dateRange.from;
        const isBeforeEnd = !dateRange.to || issueDate <= dateRange.to;
        
        return isAfterStart && isBeforeEnd;
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(issue =>
        issue.articles.some(article =>
          selectedCategories.some(category =>
            article.tags?.includes(category)
          )
        )
      );
    }

    return filtered;
  }, [issues, searchTerm, dateRange, selectedCategories]);

  const sortedIssues = useMemo(() => {
    const sorted = [...filteredIssues];
    switch (sortBy) {
      case "latest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (!isValidDate(dateA) || !isValidDate(dateB)) {
            console.error('Invalid date encountered while sorting');
            return 0;
          }
          return dateB.getTime() - dateA.getTime();
        });
      case "year":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (!isValidDate(dateA) || !isValidDate(dateB)) {
            console.error('Invalid date encountered while sorting by year');
            return 0;
          }
          const yearDiff = dateB.getFullYear() - dateA.getFullYear();
          if (yearDiff === 0) {
            // If same year, sort by month (newest first)
            return dateB.getMonth() - dateA.getMonth();
          }
          return yearDiff;
        });
      case "downloads":
        return sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      case "shares":
        return sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
      default:
        return sorted;
    }
  }, [filteredIssues, sortBy]);

  const issuesByYear = useMemo(() => {
    return sortedIssues.reduce((acc, issue) => {
      const date = new Date(issue.date);
      if (!isValidDate(date)) {
        console.error(`Invalid date for issue ${issue.id}`);
        return acc;
      }
      const year = date.getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(issue);
      return acc;
    }, {} as Record<number, Issue[]>);
  }, [sortedIssues]);

  const sortedYears = useMemo(() => {
    return Object.keys(issuesByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [issuesByYear]);

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