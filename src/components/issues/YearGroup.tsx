import { IssueCard } from "@/components/igm/IssueCard";
import { Calendar, FileText } from "lucide-react";
import type { Issue } from "@/components/igm/types";

interface YearGroupProps {
  year: number;
  issues: Issue[];
}

export const YearGroup = ({ year, issues }: YearGroupProps) => {
  return (
    <div 
      className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      role="region"
      aria-labelledby={`year-heading-${year}`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/5 p-2 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h2 
              id={`year-heading-${year}`}
              className="text-2xl font-semibold text-primary"
            >
              {year}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {issues.length} numéro{issues.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full">
          <FileText className="h-4 w-4 text-secondary-foreground/70" />
          <span className="text-sm font-medium text-secondary-foreground/70">
            {issues.reduce((acc, issue) => acc + (issue.articles?.length || 0), 0)} articles
          </span>
        </div>
      </div>
      
      <div 
        className="grid grid-cols-1 gap-6"
        role="list"
        aria-label={`Issues de ${year}`}
      >
        {issues.map((issue) => (
          <IssueCard 
            key={`${year}-${issue.id}`}
            issue={issue}
          />
        ))}
      </div>
    </div>
  );
};