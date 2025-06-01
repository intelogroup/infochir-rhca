
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('OpenAction');

interface OpenActionProps {
  id: string;
  pdfUrl?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export const OpenAction: React.FC<OpenActionProps> = ({
  id,
  pdfUrl,
  className = "",
  size = "sm",
  variant = "outline"
}) => {
  const handleOpen = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    
    if (!pdfUrl) {
      toast.error("Le PDF n'est pas disponible");
      return;
    }
    
    try {
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
      
      // Update view count in the database using RPC
      try {
        const { error } = await supabase.rpc('increment_count', {
          table_name: 'articles',
          column_name: 'views',
          row_id: id
        });
          
        if (error) {
          logger.error('Error updating view count:', error);
        }
      } catch (dbError) {
        logger.error('Database error updating view count:', dbError);
      }
    } catch (error) {
      logger.error('Error opening PDF:', error);
      toast.error("Erreur lors de l'ouverture du PDF");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      onClick={handleOpen}
      disabled={!pdfUrl}
    >
      <ExternalLink className="h-3 w-3" />
      Ouvrir
    </Button>
  );
};
