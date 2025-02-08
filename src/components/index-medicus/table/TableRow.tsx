
import { TableCell, TableRow as TableRowBase } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./TableActions";
import { ImageOptimizer } from "@/components/shared/ImageOptimizer";
import type { Article } from "../types";
import { User, BookOpen, FileText } from "lucide-react";

interface ArticleTableRowProps {
  article: Article;
}

export const ArticleTableRow = ({ article }: ArticleTableRowProps) => {
  console.log('Rendering ArticleTableRow with article:', article);

  // Add safeguards for potentially missing data
  const safeAuthors = Array.isArray(article.authors) ? article.authors : [];
  const safeDate = article.date ? new Date(article.date) : new Date();
  const safeTags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <TableRowBase className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex items-start space-x-2">
          {article.imageUrl && (
            <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
              <ImageOptimizer
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold text-lg text-primary hover:text-primary/80 cursor-pointer">
              {article.title || 'Untitled'}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              <div className="flex items-center gap-1.5 italic text-[#41b06e]">
                <User className="h-3.5 w-3.5" />
                {safeAuthors.length > 0 ? safeAuthors.join(", ") : 'No authors listed'}
              </div>
              {article.volume && article.issue && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <BookOpen className="h-3.5 w-3.5" />
                    Vol. {article.volume}, No. {article.issue}
                  </div>
                </>
              )}
              {article.pageNumber && (
                <>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <FileText className="h-3.5 w-3.5" />
                    Page {article.pageNumber}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {safeDate.getFullYear()}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {article.source}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {article.category || 'Uncategorized'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {safeTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <TableActions articleId={article.id} pdfUrl={article.pdfUrl} />
      </TableCell>
    </TableRowBase>
  );
};
