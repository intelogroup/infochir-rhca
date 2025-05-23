
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHeader as ArticleTableHeader } from "./table/TableHeader";
import { ArticleTableRow } from "./table/TableRow";
import { Article } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./table/TableActions";

interface ArticleTableProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  onTagClick,
  selectedTags = [],
}) => {
  const isMobile = useIsMobile();
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun article trouvé.</p>
      </div>
    );
  }

  // Mobile view uses card layout for better readability
  if (isMobile) {
    return (
      <div className="space-y-3">
        {articles.map((article) => (
          <Card key={article.id} className="p-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div>
                <h3 className="font-medium text-primary mb-1 line-clamp-2">{article.title}</h3>
                {article.authors?.length > 0 && (
                  <p className="text-xs text-gray-500 mb-2">
                    {article.authors?.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                  {article.tags?.slice(0, 2).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs bg-muted truncate max-w-[80px]"
                      onClick={() => onTagClick && onTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {(article.tags?.length || 0) > 2 && (
                    <Badge variant="outline" className="text-xs bg-muted">
                      +{(article.tags?.length || 0) - 2}
                    </Badge>
                  )}
                </div>
                <TableActions row={{ original: { id: article.id, title: article.title } }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop view uses a proper table with all columns
  return (
    <div className="rounded-md border">
      <TableContainer>
        <Table>
          <ArticleTableHeader />
          <TableBody>
            {articles.map((article) => (
              <ArticleTableRow 
                key={article.id}
                article={article}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
