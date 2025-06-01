
import React from 'react';
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";
import type { RhcaArticle } from "../types";

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <div className="flex items-center gap-0.5">
        <ShareAction 
          id={article.id}
          title={article.title}
          contentType="rhca"
          className="bg-blue-50 px-1 py-0.5 rounded border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all duration-200 text-[10px] font-medium h-5"
        />
        
        {pdfUrl && (
          <>
            <OpenAction
              id={article.id}
              pdfUrl={pdfUrl}
              className="bg-green-50 px-1 py-0.5 rounded border border-green-200 text-green-700 hover:bg-green-100 transition-all duration-200 text-[10px] font-medium h-5"
            />
            
            <DownloadAction
              id={article.id}
              title={article.title}
              pdfUrl={pdfUrl}
              contentType="rhca"
              className="bg-amber-50 px-1 py-0.5 rounded border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all duration-200 text-[10px] font-medium h-5"
            />
          </>
        )}
      </div>
    </div>
  );
};
