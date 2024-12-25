import type { Issue } from "./types";
import { YearGroup } from "./YearGroup";

interface IssuesListProps {
  issues: Issue[];
}

export const IssuesList = ({ issues }: IssuesListProps) => {
  // Group issues by year
  const issuesByYear = issues.reduce((acc, issue) => {
    const year = new Date(issue.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(issue);
    return acc;
  }, {} as Record<number, Issue[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(issuesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-4">
      {sortedYears.map((year) => (
        <YearGroup 
          key={year}
          year={year}
          issues={issuesByYear[year]}
        />
      ))}
    </div>
  );
};