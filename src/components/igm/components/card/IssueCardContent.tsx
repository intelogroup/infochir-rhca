
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
      // Return unique tags (up to 2 for more compact layout)
      return [...new Set(allTags)].slice(0, 2);
    } catch (error) {
      console.error('Error extracting tags:', error);
      return [];
    }
  })();

  return (
    <div className="flex-1 min-w-0 space-y-0.5">
      <div className="min-w-0">
        <h3 className="text-[11px] font-semibold text-gray-900 leading-tight tracking-tight line-clamp-2 mb-0.5">
          {issue.title || 'Sans titre'}
        </h3>
        <div className="text-[10px] font-medium text-gray-700">
          {issue.volume ? `Vol. ${issue.volume}` : 'Vol. -'} • {issue.issue ? `No. ${issue.issue}` : 'No. -'}
        </div>
        <div className="flex items-center gap-1 text-[9px] text-gray-600 mb-0.5">
          <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
          <span className="truncate">
            {formattedDate}
          </span>
        </div>
      </div>
      
      {getTags.length > 0 && (
        <div className="flex flex-wrap gap-0.5">
          {getTags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-1 py-0.5 rounded text-[7px] font-medium bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <p className="text-[10px] text-gray-600 leading-relaxed line-clamp-2">
        {issue.abstract || 'Aucun résumé disponible'}
      </p>
    </div>
  );
};
