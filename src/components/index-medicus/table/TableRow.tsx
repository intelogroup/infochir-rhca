import { TableCell, TableRow as TableRowBase } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./TableActions";
import type { Article } from "../types";

interface ArticleTableRowProps {
  article: Article;
}

export const ArticleTableRow = ({ article }: ArticleTableRowProps) => {
  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  return (
    <TableRowBase className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex items-start space-x-2">
          <div className="flex-1">
            <div className="font-medium text-primary hover:text-primary-light cursor-pointer">
              {article.title}
            </div>
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
              {article.abstract}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {getYear(article.date)}
      </TableCell>
      <TableCell>
        <div className="max-w-[200px] truncate">
          {article.authors.join(", ")}
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`
            font-semibold
            ${article.source === 'RHCA' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            ${article.source === 'IGM' ? 'bg-green-50 text-green-700 border-green-200' : ''}
            ${article.source === 'ADC' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
          `}
        >
          {article.source}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {article.category}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {article.tags.map((tag) => (
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