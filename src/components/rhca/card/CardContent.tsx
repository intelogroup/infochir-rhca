
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { CardActions } from "./CardActions";
import type { RhcaArticle } from "../types";

interface CardContentProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardContent: React.FC<CardContentProps> = ({ article, pdfUrl }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center text-sm text-muted-foreground mb-1">
        <CalendarIcon className="mr-1 h-3 w-3" />
        <span>
          {article.publicationDate ? new Date(article.publicationDate).toLocaleDateString('fr-FR') : 'Date non disponible'}
        </span>
      </div>
      
      <h3 className="font-semibold leading-tight line-clamp-2 mb-2">{article.title}</h3>
      
      {article.abstract && (
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {article.abstract}
        </p>
      )}
      
      <div className="flex flex-wrap gap-1.5 mt-auto mb-2">
        {article.tags && article.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="outline" className="px-2 py-0 text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-auto">
        <CardActions article={article} pdfUrl={pdfUrl} />
      </div>
    </div>
  );
};
