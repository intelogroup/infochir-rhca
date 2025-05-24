
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, Quote } from "lucide-react";
import { Article } from "../types";
import { PdfActions } from "./actions/PdfActions";
import { ShareAction } from "./actions/ShareAction";
import { CitationActions } from "./actions/CitationActions";

interface ArticleActionsProps {
  article: Article;
  pdfUrl?: string | null;
  hideDownload?: boolean;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({
  article,
  pdfUrl = null,
  hideDownload = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <ShareAction 
        articleId={article.id} 
        articleTitle={article.title}
      />
      
      <CitationActions article={article} />
      
      {!hideDownload && pdfUrl && (
        <PdfActions 
          article={article}
          pdfUrl={pdfUrl}
        />
      )}
    </div>
  );
};
