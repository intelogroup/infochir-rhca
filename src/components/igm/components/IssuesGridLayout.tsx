
import React from 'react';
import { IssueCard } from '../IssueCard';
import { Issue } from '../types';
import { IssueCardSkeleton } from './IssueCardSkeleton';

interface IssuesGridLayoutProps {
  issues: Issue[];
  loading: boolean;
  selectedIssueId: string | null;
  onIssueSelect: (issue: Issue) => void;
  filter: (issue: Issue) => boolean;
}

export const IssuesGridLayout: React.FC<IssuesGridLayoutProps> = ({
  issues,
  loading,
  selectedIssueId,
  onIssueSelect,
  filter
}) => {
  // Generate skeleton cards for loading state
  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <IssueCardSkeleton key={`skeleton-${index}`} />
      ));
  };

  // Filter issues
  const filteredIssues = issues.filter(filter);

  // Render issue cards
  const renderIssueCards = () => {
    if (filteredIssues.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
          <p className="text-lg font-medium text-muted-foreground mb-2">
            Aucun numéro ne correspond à votre recherche
          </p>
          <p className="text-sm text-muted-foreground">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
        </div>
      );
    }

    return filteredIssues.map((issue) => (
      <IssueCard
        key={issue.id}
        issue={issue}
        onSelect={() => onIssueSelect(issue)}
        isSelected={issue.id === selectedIssueId}
      />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? renderSkeletons() : renderIssueCards()}
    </div>
  );
};

export default IssuesGridLayout;
