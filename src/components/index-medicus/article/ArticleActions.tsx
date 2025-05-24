
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
  const generateCitation = React.useCallback((format: 'APA' | 'MLA' | 'Chicago' | 'Harvard') => {
    const year = new Date(article.publicationDate).getFullYear();
    const authors = article.authors.join(", ");
    let citation = '';

    switch (format) {
      case 'APA':
        citation = `${authors} (${year}). ${article.title}. ${article.source}, ${article.category}. DOI: ${article.id}`;
        break;
      case 'MLA':
        citation = `${authors}. "${article.title}." ${article.source}, ${year}.`;
        break;
      case 'Chicago':
        citation = `${authors}. "${article.title}." ${article.source} (${year}).`;
        break;
      case 'Harvard':
        citation = `${authors} ${year}, '${article.title}', ${article.source}, ${article.category}.`;
        break;
      default:
        citation = `${authors} (${year}). ${article.title}`;
    }

    navigator.clipboard.writeText(citation);
  }, [article]);

  return (
    <div className="flex items-center gap-2">
      <ShareAction 
        articleId={article.id} 
        articleTitle={article.title}
      />
      
      <CitationActions onCitation={generateCitation} />
      
      {!hideDownload && pdfUrl && (
        <PdfActions 
          article={article}
          pdfUrl={pdfUrl}
        />
      )}
    </div>
  );
};
