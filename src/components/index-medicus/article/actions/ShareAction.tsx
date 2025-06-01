
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
      variant="outline"
      size="sm"
      className="bg-blue-50 px-1 py-0.5 rounded border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all duration-200 text-[10px] font-medium h-5"
      onClick={handleShare}
      disabled={isSharing}
    >
      <Share2 className="mr-0.5 h-2 w-2" />
      Partager
    </Button>
  );
};
