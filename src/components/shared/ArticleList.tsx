import { Article } from "@/types/article";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Loader2 } from "lucide-react";

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  showSource?: boolean;
}

export const ArticleList = ({ 
  articles, 
  onEdit, 
  onDelete, 
  isLoading,
  showSource = false
}: ArticleListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          {showSource && <TableHead>Source</TableHead>}
          <TableHead>Volume</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>PDF</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell className="font-medium">{article.title}</TableCell>
            {showSource && <TableCell>{article.source}</TableCell>}
            <TableCell>{article.volume}</TableCell>
            <TableCell>{article.issue_number}</TableCell>
            <TableCell>
              {new Date(article.date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {article.pdf_url ? "✓" : "✗"}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(article)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(article.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};