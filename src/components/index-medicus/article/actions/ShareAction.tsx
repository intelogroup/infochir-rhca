
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
      variant="default" 
      size="sm"
      className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Partager
    </Button>
  );
};
