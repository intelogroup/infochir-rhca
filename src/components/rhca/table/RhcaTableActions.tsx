
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { getStorageUrl } from "@/integrations/supabase/client";
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";
import { useIsMobile } from "@/hooks/use-mobile";
import type { RhcaArticle } from "../types";

interface RhcaTableActionsProps {
  article: RhcaArticle;
}

export const RhcaTableActions: React.FC<RhcaTableActionsProps> = ({ article }) => {
  const isMobile = useIsMobile();
  
  // Get PDF URL if available
  const pdfUrl = article.pdfFileName ? getStorageUrl('rhca-pdfs', article.pdfFileName) : null;

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-1 justify-end">
        <ShareAction
          id={article.id}
          title={article.title}
          contentType="rhca"
          className="h-8 px-2 py-1 text-xs"
        />
        
        {pdfUrl && (
          <>
            <OpenAction
              id={article.id}
              pdfUrl={pdfUrl}
              className="h-8 px-2 py-1 text-xs"
            />
            
            <DownloadAction
              id={article.id}
              title={article.title}
              pdfUrl={pdfUrl}
              contentType="rhca"
              className="h-8 px-2 py-1 text-xs"
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => e.preventDefault()}>
            <ShareAction
              id={article.id}
              title={article.title}
              contentType="rhca"
              variant="ghost"
              size="sm"
              className="w-full justify-start p-0"
            />
          </DropdownMenuItem>
          {pdfUrl && (
            <>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <OpenAction
                  id={article.id}
                  pdfUrl={pdfUrl}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-0"
                />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <DownloadAction
                  id={article.id}
                  title={article.title}
                  pdfUrl={pdfUrl}
                  contentType="rhca"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start p-0"
                />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
