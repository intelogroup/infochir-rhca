import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Issue } from "../../types";

interface IssueCardContentProps {
  issue: Issue;
}

export const IssueCardContent = ({ issue }: IssueCardContentProps) => {
  return (
    <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
      <div className="flex justify-between items-start gap-2 sm:gap-4">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-primary leading-tight tracking-tight truncate group-hover:text-primary-light transition-colors">
            {issue.title}
          </h3>
          <div className="text-xs sm:text-sm font-medium text-secondary/80 mt-0.5 sm:mt-1">
            {issue.volume} • {issue.issue}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 mt-0.5 sm:mt-1">
            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <span className="truncate">
              {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {issue.abstract}
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
        <span className="bg-secondary/5 px-2 py-1 rounded-full">
          {issue.articles?.length || 0} articles
        </span>
        <span>{issue.downloads} téléchargements</span>
        <span>{issue.shares} partages</span>
      </div>
    </div>
  );
};