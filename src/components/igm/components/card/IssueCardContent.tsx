
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArticleTags } from "@/components/index-medicus/article/ArticleTags";
import type { Issue } from "../../types";

interface IssueCardContentProps {
  issue: Issue;
}

export const IssueCardContent = ({ issue }: IssueCardContentProps) => {
  // Safely format the date
  const formattedDate = (() => {
    try {
      return format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  })();

  // Extract tags from articles
  const getTags = (() => {
    try {
      // Collect all tags from articles
      const allTags: string[] = [];
      issue.articles?.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          allTags.push(...article.tags);
        }
      });
      // Return unique tags (up to 5)
      return [...new Set(allTags)].slice(0, 5);
    } catch (error) {
      console.error('Error extracting tags:', error);
      return [];
    }
  })();

  return (
    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 leading-tight tracking-tight truncate">
            {issue.title || 'Sans titre'}
          </h3>
          <div className="text-sm font-medium text-gray-700">
            {issue.volume ? `Vol. ${issue.volume}` : 'Vol. -'} • {issue.issue ? `No. ${issue.issue}` : 'No. -'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
        {issue.abstract || 'Aucun résumé disponible'}
      </p>
      
      {getTags.length > 0 ? (
        <div className="flex flex-wrap gap-1 mt-1">
          <ArticleTags tags={getTags} />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="bg-secondary/10 px-2 py-0.5 rounded-full font-medium">
            {issue.articles?.length || 0} article{(issue.articles?.length || 0) !== 1 ? 's' : ''}
          </span>
          <span>{issue.downloads || 0} téléchargements</span>
          <span>{issue.shares || 0} partages</span>
        </div>
      )}
    </div>
  );
};
