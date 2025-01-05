import { useMemo } from "react";
import { getSortFunction } from "../utils/sortingUtils";
import { filterIssuesBySearch } from "../utils/filterUtils";
import type { Issue } from "../types";

export const useIssuesState = (
  issues: Issue[],
  searchTerm: string,
  sortBy: string
) => {
  const filteredIssues = useMemo(() => {
    return filterIssuesBySearch(issues, searchTerm);
  }, [issues, searchTerm]);

  const sortedIssues = useMemo(() => {
    const sortFn = getSortFunction(sortBy);
    return [...filteredIssues].sort(sortFn);
  }, [filteredIssues, sortBy]);

  const issuesByYear = useMemo(() => {
    return sortedIssues.reduce((acc, issue) => {
      const year = new Date(issue.date).getFullYear();
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

  return {
    filteredIssues,
    sortedIssues,
    issuesByYear,
    sortedYears,
  };
};