
import React from 'react';
import { IssueCard } from "../IssueCard";
import type { Issue } from "../types";

interface IssuesGridLayoutProps {
  issues: Issue[];
  selectedIssue: Issue | null;
  onSelectIssue: (issue: Issue) => void;
}

export const IssuesGridLayout: React.FC<IssuesGridLayoutProps> = ({
  issues,
  selectedIssue,
  onSelectIssue,
}) => {
  if (!issues.length) {
    return (
      <div className="col-span-full flex justify-center p-8 text-muted-foreground">
        Aucun numéro trouvé
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          isSelected={selectedIssue?.id === issue.id}
          onClick={() => onSelectIssue(issue)}
        />
      ))}
    </div>
  );
};
