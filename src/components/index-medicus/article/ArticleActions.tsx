
import React from "react";
import { Article } from "../types";
import { PdfActions } from "./actions/PdfActions";
import { CitationActions } from "./actions/CitationActions";
import { ShareAction } from "./actions/ShareAction";
import { ViewAction } from "./actions/ViewAction";

export interface ArticleActionsProps {
  title?: string;
  pdfUrl?: string;
  hideDownload?: boolean;
  showViewButton?: boolean;
  article?: Article;
  onCitation?: (format: "APA" | "MLA" | "Chicago" | "Harvard") => void;
  onShare?: () => void;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({
  title = "",
  pdfUrl,
  hideDownload = false,
  showViewButton = false,
  article,
  onCitation = () => {},
  onShare,
}) => {
  return (
    <div className="flex gap-2">
      <ShareAction 
        onShare={onShare} 
        articleId={article?.id}
      />
      <PdfActions 
        title={title}
        pdfUrl={pdfUrl}
        hideDownload={hideDownload}
      />
      <ViewAction 
        article={article}
        showViewButton={showViewButton}
      />
      <CitationActions onCitation={onCitation} />
    </div>
  );
};
