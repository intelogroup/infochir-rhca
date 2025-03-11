
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
import { Download, Share2, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RhcaArticle } from "../types";
import { downloadPDF } from "@/lib/analytics/download";
import { createLogger } from "@/lib/error-logger";
import { useIsMobile } from "@/hooks/use-mobile";

const logger = createLogger('RhcaTableActions');

interface RhcaTableActionsProps {
  article: RhcaArticle;
}

export const RhcaTableActions: React.FC<RhcaTableActionsProps> = ({ article }) => {
  const isMobile = useIsMobile();

  const handleDownload = async () => {
    try {
      if (!article.pdfFileName) {
        toast.error("PDF non disponible");
        return;
      }
      
      const { data } = await supabase.storage
        .from('rhca-pdfs')
        .getPublicUrl(article.pdfFileName);
        
      // Use the standardized downloadPDF function with tracking
      const fileName = `RHCA-${article.title.slice(0, 30)}.pdf`;
      
      const success = await downloadPDF({
        url: data.publicUrl,
        fileName,
        documentId: article.id,
        documentType: 'rhca',
        trackingEnabled: true
      });
      
      if (!success) {
        throw new Error('Download failed');
      }
    } catch (error) {
      logger.error(error);
      toast.error("Erreur lors du téléchargement");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract || "Découvrez cet article de la RHCA",
        url: window.location.href
      }).catch(error => {
        console.error('[RhcaTable] Error sharing:', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
    
    // Track share
    try {
      supabase.rpc('increment_count', { 
        table_name: 'articles', 
        column_name: 'shares', 
        row_id: article.id 
      });
    } catch (error) {
      console.error('[RhcaTable] Error incrementing share count:', error);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-1 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2 py-1 text-xs"
          onClick={handleDownload}
        >
          <Download className="h-3 w-3 mr-1" />
          PDF
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2 py-1 text-xs"
          onClick={handleShare}
        >
          <Share2 className="h-3 w-3 mr-1" />
          Partager
        </Button>
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
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
