import React from 'react';
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";
import type { RhcaArticle } from "../types";

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

const actionClass =
  "h-7 px-2 rounded-none bg-transparent text-xs font-medium text-foreground/70 hover:text-primary hover:bg-transparent";

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <ShareAction
        id={article.id}
        title={article.title}
        contentType="rhca"
        className={actionClass}
      />

      {pdfUrl && (
        <>
          <OpenAction id={article.id} pdfUrl={pdfUrl} className={actionClass} />
          <DownloadAction
            id={article.id}
            title={article.title}
            pdfUrl={pdfUrl}
            contentType="rhca"
            className={actionClass}
          />
        </>
      )}
    </div>
  );
};
