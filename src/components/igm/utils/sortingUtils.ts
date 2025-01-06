import type { Issue } from "../types";

export const sortByDate = (a: Issue, b: Issue) => 
  new Date(b.date).getTime() - new Date(a.date).getTime();

export const sortByYear = (a: Issue, b: Issue) => {
  const yearDiff = new Date(b.date).getFullYear() - new Date(a.date).getFullYear();
  if (yearDiff === 0) {
    // If same year, sort by month (newest first)
    return new Date(b.date).getMonth() - new Date(a.date).getMonth();
  }
  return yearDiff;
};

export const sortByDownloads = (a: Issue, b: Issue) => 
  (b.downloads || 0) - (a.downloads || 0);

export const sortByShares = (a: Issue, b: Issue) => 
  (b.shares || 0) - (a.shares || 0);

export const sortByArticleCount = (a: Issue, b: Issue) =>
  b.articleCount - a.articleCount;

export const getSortFunction = (sortBy: string) => {
  switch (sortBy) {
    case "latest":
      return sortByDate;
    case "year":
      return sortByYear;
    case "downloads":
      return sortByDownloads;
    case "shares":
      return sortByShares;
    case "articles":
      return sortByArticleCount;
    default:
      return sortByDate;
  }
};