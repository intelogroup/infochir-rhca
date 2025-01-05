import type { Issue } from "../types";

export const sortIssues = (issues: Issue[], sortType: string) => {
  let sorted = [...issues];
  switch (sortType) {
    case "latest":
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case "year":
      sorted.sort((a, b) => {
        const yearA = new Date(a.date).getFullYear();
        const yearB = new Date(b.date).getFullYear();
        return yearB - yearA;
      });
      break;
    case "downloads":
      sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case "shares":
      sorted.sort((a, b) => (b.shares || 0) - (a.shares || 0));
      break;
    default:
      break;
  }
  return sorted;
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