
import * as React from "react";
import { PdfActions } from "./actions/PdfActions";
import { ShareAction } from "./actions/ShareAction";
import { ViewAction } from "./actions/ViewAction";
import type { Article } from "../types";

interface ArticleActionsProps {
  article: Article;
  pdfUrl?: string | null;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({ article, pdfUrl }) => {
  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
  };

  return (
    <div className="flex items-center gap-2 flex-wrap" onClick={handleActionsClick}>
      <ShareAction 
        articleId={article.id} 
        articleTitle={article.title}
      />
      
      <ViewAction articleId={article.id} />
      
      <PdfActions 
        article={article}
        pdfUrl={pdfUrl}
      />
    </div>
  );
};
