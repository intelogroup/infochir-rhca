
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareActionProps {
  articleId: string;
  articleTitle: string;
}

export const ShareAction: React.FC<ShareActionProps> = ({ articleId, articleTitle }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);

    try {
      const shareData = {
        title: articleTitle,
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success("Article partagé avec succès");
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Lien copié dans le presse-papiers");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Erreur lors du partage:', error);
        toast.error("Impossible de partager l'article");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 rounded-none px-2 text-xs font-medium text-foreground/70 hover:bg-transparent hover:text-primary"
      onClick={handleShare}
      disabled={isSharing}
    >
      <Share2 className="mr-1.5 h-3.5 w-3.5" />
      Partager
    </Button>
  );
};
