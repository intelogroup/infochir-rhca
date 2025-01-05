import type { Issue } from "../types";

export const sortIssues = (issues: Issue[], sortBy: string) => {
  const sorted = [...issues];
  
  switch (sortBy) {
    case "latest":
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case "year":
      return sorted.sort((a, b) => new Date(b.date).getFullYear() - new Date(a.date).getFullYear());
    case "downloads":
      return sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    case "shares":
      return sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
    default:
      return sorted;
  }
};

export const groupIssuesByYear = (issues: Issue[]) => {
  return issues.reduce((acc, issue) => {
    const year = new Date(issue.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);
};

export const getSortedYears = (issuesByYear: Record<number, Issue[]>) => {
  return Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);
};