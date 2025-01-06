import { TableCell, TableRow as TableRowBase } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./TableActions";
import type { Article } from "../types";
import { User } from "lucide-react";

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
          <div className="flex-1">
            <div className="font-medium text-primary hover:text-primary-light cursor-pointer">
              {article.title || 'Untitled'}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              {safeAuthors.length > 0 ? safeAuthors.join(", ") : 'No authors listed'}
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