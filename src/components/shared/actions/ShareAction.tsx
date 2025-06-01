
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('ShareAction');

interface ShareActionProps {
  id: string;
  title: string;
  contentType: 'igm' | 'rhca';
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export const ShareAction: React.FC<ShareActionProps> = ({
  id,
  title,
  contentType,
  className = "",
  size = "sm",
  variant = "outline"
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    
    try {
      setIsSharing(true);
      
      // Generate the correct share URL based on content type
      const shareUrl = contentType === 'igm' 
        ? `${window.location.origin}/igm/issues/${id}`
        : `${window.location.origin}/rhca/articles/${id}`;
      
      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Découvrez "${title}" sur ${contentType === 'igm' ? 'Info Gazette Médicale' : 'RHCA'}`,
          url: shareUrl
        });
        toast.success("Contenu partagé avec succès");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Lien copié dans le presse-papier");
      }
      
      // Update share count in the database using RPC
      try {
        const { error } = await supabase.rpc('increment_count', {
          table_name: 'articles',
          column_name: 'shares',
          row_id: id
        });
          
        if (error) {
          logger.error('Error updating share count:', error);
        }
      } catch (dbError) {
        logger.error('Database error updating share count:', dbError);
      }
    } catch (error) {
      logger.error('Error sharing:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Erreur lors du partage");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      onClick={handleShare}
      disabled={isSharing}
    >
      <Share2 className="h-3 w-3" />
      Partager
    </Button>
  );
};
