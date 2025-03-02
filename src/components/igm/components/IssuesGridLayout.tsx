import React from 'react';
import type { Issue } from '../types';

interface IssuesGridLayoutProps {
  issues: Issue[];
  selectedIssueId: string | null;
  onIssueSelect: (issueId: string) => void;
}

interface IssueCardProps {
  issue: Issue;
  isSelected?: boolean;
  onClick: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, isSelected, onClick }) => {
  return (
    <div
      className={`relative rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      onClick={onClick}
    >
      <div className="aspect-w-4 aspect-h-5">
        {issue.coverImage ? (
          <img
            src={issue.coverImage}
            alt={issue.title}
            className="rounded-md object-cover shadow-sm"
          />
        ) : (
          <div className="bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">No Cover</span>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-2 rounded-b-md text-sm">
        {issue.title}
      </div>
    </div>
  );
};

export const IssuesGridLayout: React.FC<IssuesGridLayoutProps> = ({ issues, selectedIssueId, onIssueSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          isSelected={issue.id === selectedIssueId}
          onClick={() => onIssueSelect(issue.id)}
        />
      ))}
    </div>
  );
};
