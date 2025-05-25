
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { ShareAction } from "@/components/index-medicus/article/actions/ShareAction";
import type { RhcaVolume } from "../types";

interface VolumeModalActionsProps {
  volume: RhcaVolume;
}

export const VolumeModalActions: React.FC<VolumeModalActionsProps> = ({ volume }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log('Download initiated for RHCA volume:', volume.id);
    
    if (!volume.pdfFileName) {
      toast.error("Le PDF n'est pas disponible pour le moment");
      return;
    }
    
    try {
      // Generate PDF URL for RHCA volumes
      const pdfUrl = `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/rhca-pdfs/${volume.pdfFileName}`;
      
      // Generate a proper filename
      const fileName = `RHCA-Vol${volume.volume}-Issue${volume.issue}-${volume.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.pdf`;
      
      console.log('Attempting download with filename:', fileName);
      
      // Use the standardized downloadPDF function with RHCA document type
      const success = await downloadPDF({
        url: pdfUrl,
        fileName,
        documentId: volume.id,
        documentType: DocumentType.RHCA,
        trackingEnabled: true
      });
      
      if (!success) {
        // Fallback: direct download
        console.log('Standard download failed, trying direct download...');
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Téléchargement du PDF en cours...");
      } else {
        toast.success("Téléchargement du PDF en cours...");
      }
      
      // Update download count
      const { error } = await supabase
        .from('rhca_volumes')
        .update({ downloadCount: (volume.downloadCount || 0) + 1 })
        .eq('id', volume.id);
      
      if (error) {
        console.error('Error updating download count:', error);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <ShareAction 
        articleId={volume.id} 
        articleTitle={volume.title}
      />
      
      {volume.pdfFileName && (
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      )}
    </div>
  );
};
