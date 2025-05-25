
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareActionProps {
  articleId: string;
  articleTitle: string;
}

export const ShareAction: React.FC<ShareActionProps> = ({ articleId, articleTitle }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/articles/${articleId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié dans le presse-papier");
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error("Erreur lors de la copie du lien");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="h-6 px-1.5 text-xs font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
      onClick={handleShare}
    >
      <Share2 className="h-3 w-3 mr-0.5" />
      Partager
    </Button>
  );
};
