
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

interface RhcaTableActionsProps {
  article: RhcaArticle;
}

export const RhcaTableActions: React.FC<RhcaTableActionsProps> = ({ article }) => {
  const handleDownload = async () => {
    try {
      if (article.pdfFileName) {
        const { data } = await supabase.storage
          .from('rhca-pdfs')
          .getPublicUrl(article.pdfFileName);
          
        window.open(data.publicUrl, '_blank');
        
        // Track download
        try {
          await supabase.rpc('increment_count', { 
            table_name: 'articles', 
            column_name: 'downloads', 
            row_id: article.id 
          });
        } catch (error) {
          console.error('[RhcaTable] Error incrementing download count:', error);
        }
      } else {
        toast.error("PDF non disponible");
      }
    } catch (error) {
      console.error('[RhcaTable] Error downloading PDF:', error);
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
