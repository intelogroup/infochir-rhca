
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { downloadPDF } from "@/lib/analytics/download";
import { DocumentType } from "@/lib/analytics/download/statistics/types";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";
import { handleMobileDownload, getMobileDownloadInstructions } from "@/lib/mobile/download-handler";
import { useIsMobile } from "@/hooks/use-mobile";

const logger = createLogger('DownloadAction');

interface DownloadActionProps {
  id: string;
  title: string;
  pdfUrl?: string;
  contentType: 'igm' | 'rhca';
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export const DownloadAction: React.FC<DownloadActionProps> = ({
  id,
  title,
  pdfUrl,
  contentType,
  className = "",
  size = "sm",
  variant = "default"
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const isMobile = useIsMobile();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible pour ce document");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Generate a proper filename with timestamp for uniqueness
      const prefix = contentType === 'igm' ? 'IGM' : 'RHCA';
      const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 30);
      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const fileName = `${prefix}_${cleanTitle}_${timestamp}.pdf`;
      
      logger.log(`Starting download: ${fileName} (Mobile: ${isMobile})`);
      
      if (isMobile) {
        // Use mobile-optimized download handler
        const success = await handleMobileDownload(
          pdfUrl,
          fileName,
          async () => {
            // Success callback - update download count using RPC
            try {
              const { error } = await supabase.rpc('increment_count', {
                table_name: 'articles',
                column_name: 'downloads',
                row_id: id
              });
                
              if (error) {
                logger.error('Error updating download count:', error);
              }
            } catch (dbError) {
              logger.error('Database error updating download count:', dbError);
            }
            
            toast.success("Téléchargement réussi");
          },
          (error) => {
            logger.error('Mobile download failed:', error);
            toast.error("Erreur lors du téléchargement");
          }
        );
        
        // Show mobile-specific instructions
        if (success) {
          setTimeout(() => {
            toast.info(getMobileDownloadInstructions(), {
              duration: 5000
            });
          }, 1000);
        }
      } else {
        // Enhanced desktop download with blob handling
        const documentType = contentType === 'igm' ? DocumentType.IGM : DocumentType.RHCA;
        
        logger.log('Starting desktop download with enhanced blob handling');
        
        const success = await downloadPDF({
          url: pdfUrl,
          fileName,
          documentId: id,
          documentType,
          trackingEnabled: true
        });
        
        if (success) {
          toast.success("Téléchargement du PDF en cours...", {
            description: "Le fichier est sauvegardé dans votre dossier Téléchargements"
          });
          
          // Update download count in articles table using RPC
          try {
            const { error } = await supabase.rpc('increment_count', {
              table_name: 'articles',
              column_name: 'downloads',
              row_id: id
            });
              
            if (error) {
              logger.error('Error updating download count:', error);
            }
          } catch (dbError) {
            logger.error('Database error updating download count:', dbError);
          }
        } else {
          toast.error("Erreur lors du téléchargement", {
            description: "Veuillez réessayer ou contactez le support"
          });
        }
      }
    } catch (error) {
      logger.error('Download error:', error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      onClick={handleDownload}
      disabled={isDownloading || !pdfUrl}
    >
      <Download className="h-3 w-3" />
      PDF
    </Button>
  );
};
