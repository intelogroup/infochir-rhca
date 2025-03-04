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

  // Calculate total page count from articles
  const getTotalPages = (() => {
    try {
      if (!issue.articles || issue.articles.length === 0) {
        return "- Pages";
      }
      
      // Get all valid page numbers
      const pageNumbers = issue.articles
        .map(article => article.pageNumber)
        .filter(pageNum => pageNum && pageNum > 0);
      
      if (pageNumbers.length === 0) {
        return "- Pages";
      }
      
      // Get the min and max page numbers
      const minPage = Math.min(...pageNumbers);
      const maxPage = Math.max(...pageNumbers);
      
      // Calculate total pages (including both start and end pages)
      const totalPages = maxPage - minPage + 1;
      
      return `${totalPages} Page${totalPages > 1 ? 's' : ''}`;
    } catch (error) {
      console.error('Error calculating total pages:', error);
      return "- Pages";
    }
  })();

  return (
    <div className="flex-1 min-w-0 space-y-2">
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
      
      {getTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 mb-1">
          <ArticleTags tags={getTags} />
        </div>
      )}
      
      <p className="text-sm text-gray-600 leading-relaxed">
        {issue.abstract || 'Aucun résumé disponible'}
      </p>
      
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
        <span className="bg-secondary/10 px-2 py-0.5 rounded-full font-medium">
          {getTotalPages}
        </span>
        <span>{issue.downloads || 0} téléchargements</span>
        <span>{issue.shares || 0} partages</span>
      </div>
    </div>
  );
};
