
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RhcaArticle } from "../types";

interface CardActionsProps {
  article: RhcaArticle;
  pdfUrl: string | null;
}

export const CardActions: React.FC<CardActionsProps> = ({ article, pdfUrl }) => {
  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      
      // Track download count in analytics
      try {
        supabase.rpc('increment_count', { 
          table_name: 'articles', 
          column_name: 'downloads', 
          row_id: article.id 
        });
      } catch (error) {
        console.error('[RhcaCard] Error incrementing download count:', error);
      }
    } else {
      toast.error("Le PDF n'est pas disponible pour le moment");
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.abstract || "Découvrez cet article de la RHCA",
        url: window.location.href
      }).then(() => {
        // Track share count
        try {
          supabase.rpc('increment_count', { 
            table_name: 'articles', 
            column_name: 'shares', 
            row_id: article.id 
          });
        } catch (error) {
          console.error('[RhcaCard] Error incrementing share count:', error);
        }
      }).catch(error => {
        console.error('[RhcaCard] Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier");
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 px-2"
        onClick={handleDownload}
        disabled={!pdfUrl}
      >
        <Download className="h-4 w-4 mr-1" />
        PDF
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="h-8 px-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4 mr-1" />
        Partager
      </Button>
    </div>
  );
};
