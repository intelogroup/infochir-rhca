import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Issue } from "../../types";

interface IssueCardContentProps {
  issue: Issue;
}

export const IssueCardContent = ({ issue }: IssueCardContentProps) => {
  return (
    <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-primary leading-tight tracking-tight truncate group-hover:text-primary-light transition-colors">
            {issue.title}
          </h3>
          <div className="text-sm font-medium text-secondary/80 mt-1">
            {issue.volume} • {issue.issue}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">
              {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {issue.abstract}
      </p>
      <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
        <span className="bg-secondary/5 px-2 py-1 rounded-full">
          {issue.articleCount} articles
        </span>
        <span>{issue.downloads} téléchargements</span>
        <span>{issue.shares} partages</span>
      </div>
    </div>
  );
};