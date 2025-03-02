
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
        <TableHeader className="bg-primary/5">
          <TableRow>
            <TableHead className="w-[400px] font-semibold text-primary">Titre</TableHead>
            <TableHead className="font-semibold text-primary">Auteurs</TableHead>
            <TableHead className="font-semibold text-primary">Source</TableHead>
            <TableHead className="font-semibold text-primary">Date</TableHead>
            <TableHead className="text-right font-semibold text-primary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun article trouvé
              </TableCell>
            </TableRow>
          )}
          
          {articles.map((article) => (
            <TableRow 
              key={article.id} 
              className="group border-b border-gray-100 hover:bg-primary/[0.02] transition-colors"
            >
              <TableCell className="font-medium py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-primary/90 group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                  {article.abstract && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.abstract}
                    </p>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                <div className="max-w-[200px] truncate">
                  {Array.isArray(article.authors) && article.authors.length > 0 
                    ? article.authors.join(", ")
                    : "—"}
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                <Badge variant="outline" className="capitalize bg-secondary/5 hover:bg-secondary/10">
                  {article.source}
                </Badge>
                {article.volume && article.issue && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Vol. {article.volume}, No. {article.issue}
                  </div>
                )}
              </TableCell>
              
              <TableCell className="py-4">
                {article.publicationDate ? formatDate(article.publicationDate) : "—"}
              </TableCell>
              
              <TableCell className="text-right py-4">
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
