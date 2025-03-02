
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Article } from "./types";
import { ArticleMetadata } from "./article/ArticleMetadata";
import { ArticleActions } from "./article/ArticleActions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ArticleTableProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export function ArticleTable({ articles, onTagClick, selectedTags = [] }: ArticleTableProps) {
  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Titre</TableHead>
            <TableHead>Auteurs</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucun article trouvé
              </TableCell>
            </TableRow>
          )}
          
          {articles.map((article) => (
            <TableRow key={article.id} className="group">
              <TableCell className="font-medium">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{article.title}</span>
                  {article.abstract && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.abstract}
                    </p>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="max-w-[150px] truncate">
                  {Array.isArray(article.authors) && article.authors.length > 0 
                    ? article.authors.join(", ")
                    : "—"}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {article.source}
                </Badge>
                {article.volume && article.issue && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Vol. {article.volume}, No. {article.issue}
                  </div>
                )}
              </TableCell>
              
              <TableCell>
                {article.publicationDate ? formatDate(article.publicationDate) : "—"}
              </TableCell>
              
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                  {article.tags && article.tags.length > 0 ? (
                    article.tags.slice(0, 3).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant={selectedTags?.includes(tag) ? "default" : "secondary"}
                        className="text-xs cursor-pointer"
                        onClick={() => onTagClick?.(tag)}
                      >
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                  {article.tags && article.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{article.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <ArticleActions 
                  pdfUrl={article.pdfUrl}
                  hideDownload={!article.pdfUrl}
                  article={article}
                  showViewButton
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
