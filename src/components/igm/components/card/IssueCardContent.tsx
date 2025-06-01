
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
      // Create a new Date object from the ISO string
      const date = new Date(issue.date);
      
      // Use UTC to avoid timezone issues 
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      
      // Create a new date with UTC values but interpret them as local
      const localDate = new Date(year, month, day);
      
      return format(localDate, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, issue.date);
      return 'Date invalide';
    }
  })();

  // Extract tags from articles if available
  const getTags = (() => {
    try {
      // Collect all tags from articles if they exist
      const allTags: string[] = [];
      if (issue.articles && Array.isArray(issue.articles)) {
        issue.articles.forEach(article => {
          if (article.tags && Array.isArray(article.tags)) {
            allTags.push(...article.tags);
          }
        });
      }
      // Return unique tags (up to 3)
      return [...new Set(allTags)].slice(0, 3);
    } catch (error) {
      console.error('Error extracting tags:', error);
      return [];
    }
  })();

  return (
    <div className="flex-1 min-w-0 space-y-1">
      <div className="flex justify-between items-start gap-1">
        <div className="min-w-0">
          <h3 className="text-xs font-semibold text-gray-900 leading-tight tracking-tight line-clamp-2 mb-0.5">
            {issue.title || 'Sans titre'}
          </h3>
          <div className="text-xs font-medium text-gray-700">
            {issue.volume ? `Vol. ${issue.volume}` : 'Vol. -'} • {issue.issue ? `No. ${issue.issue}` : 'No. -'}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate text-[10px]">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      
      {getTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <ArticleTags tags={getTags} />
        </div>
      )}
      
      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
        {issue.abstract || 'Aucun résumé disponible'}
      </p>
    </div>
  );
};
