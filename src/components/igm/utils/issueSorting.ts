import type { Issue } from "../types";

export const sortIssues = (issues: Issue[], sortBy: string) => {
  const sorted = [...issues];
  
  switch (sortBy) {
    case "latest":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.error('Invalid date encountered while sorting');
          return 0;
        }
        return dateB.getTime() - dateA.getTime();
      });
    case "year":
      return sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.error('Invalid date encountered while sorting by year');
          return 0;
        }
        return dateB.getFullYear() - dateA.getFullYear();
      });
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
    const date = new Date(issue.date);
    if (isNaN(date.getTime())) {
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
};

export const getSortedYears = (issuesByYear: Record<number, Issue[]>) => {
  return Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);
};