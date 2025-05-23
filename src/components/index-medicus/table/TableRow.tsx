
import * as React from "react";
import { TableCell, TableRow as TableRowBase } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./TableActions";
import type { Article } from "../types";
import { User, BookOpen, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArticleModal } from "../article/ArticleModal";

interface ArticleTableRowProps {
  article: Article;
}

export const ArticleTableRow: React.FC<ArticleTableRowProps> = ({ article }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Add safeguards for potentially missing data
  const safeAuthors = Array.isArray(article.authors) ? article.authors : [];
  const safeDate = article.date ? new Date(article.date) : new Date();
  const safeTags = Array.isArray(article.tags) ? article.tags : [];
  const isMobile = useIsMobile();

  const handleRowClick = (e: React.MouseEvent) => {
    // Only open the modal if not clicking on buttons or actions
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('[data-tag]')) {
      return;
    }
    
    setIsModalOpen(true);
  };

  return (
    <>
      <TableRowBase className="hover:bg-muted/50 cursor-pointer" onClick={handleRowClick}>
        <TableCell className="font-medium">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-base sm:text-lg text-primary hover:text-primary/80">
              {article.title || 'Untitled'}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-2 text-xs sm:text-sm">
              <div className="flex items-center gap-1 italic text-[#41b06e] truncate max-w-[150px] sm:max-w-full">
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {safeAuthors.length > 0 ? safeAuthors.join(", ") : 'No authors listed'}
                </span>
              </div>
              {article.volume && article.issue && !isMobile && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1.5 text-gray-500">
                    <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                    Vol. {article.volume}, No. {article.issue}
                  </div>
                </>
              )}
              {article.pageNumber && !isMobile && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1.5 text-gray-500">
                    <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                    Page {article.pageNumber}
                  </div>
                </>
              )}
            </div>
          </div>
        </TableCell>
        <TableCell>
          {safeDate.getFullYear()}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <Badge variant="outline" className="font-normal">
            {article.source}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Badge variant="secondary" className="font-normal">
            {article.category || 'Uncategorized'}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {safeTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted">
                {tag}
              </Badge>
            ))}
            {safeTags.length > 2 && (
              <Badge variant="outline" className="text-xs bg-muted">
                +{safeTags.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <TableActions row={{ original: { id: article.id, title: article.title } }} />
        </TableCell>
      </TableRowBase>

      {/* Add modal component */}
      <ArticleModal
        article={article}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
