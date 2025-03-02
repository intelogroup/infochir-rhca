
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
import { ArticleActions } from "./article/ArticleActions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PdfStatusIndicator } from "@/components/shared/PdfStatusIndicator";

interface ArticleTableProps {
  articles: Article[];
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export function ArticleTable({ articles, onTagClick, selectedTags = [] }: ArticleTableProps) {
  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
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
              className="group border-b border-gray-100 hover:bg-[#F1F0FB]/50 transition-all duration-200 ease-in-out"
            >
              <TableCell className="font-medium py-5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    {article.pdfUrl && (
                      <PdfStatusIndicator 
                        status={article.pdfUrl ? "available" : "unavailable"} 
                        size="sm" 
                        className="mt-0.5"
                      />
                    )}
                    <span className="font-semibold text-primary/90 group-hover:text-primary transition-colors">
                      {article.title}
                    </span>
                  </div>
                  {article.abstract && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.abstract}
                    </p>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="py-5">
                <div className="max-w-[200px]">
                  {Array.isArray(article.authors) && article.authors.length > 0 
                    ? (
                      <span className="text-sm font-medium text-gray-700">
                        {article.authors.join(", ")}
                      </span>
                    )
                    : <span className="text-gray-400">—</span>}
                </div>
              </TableCell>
              
              <TableCell className="py-5">
                <Badge variant="outline" className="capitalize bg-secondary/5 hover:bg-secondary/10 font-medium">
                  {article.source}
                </Badge>
                {article.volume && article.issue && (
                  <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                    Vol. {article.volume}, No. {article.issue}
                  </div>
                )}
              </TableCell>
              
              <TableCell className="py-5">
                <span className="text-sm text-gray-600 font-medium">
                  {article.publicationDate ? formatDate(article.publicationDate) : 
                    <span className="text-gray-400">—</span>}
                </span>
              </TableCell>
              
              <TableCell className="text-right py-5">
                <ArticleActions 
                  pdfUrl={article.pdfUrl}
                  hideDownload={!article.pdfUrl}
                  article={article}
                  showViewButton={true}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
