
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface ShareActionProps {
  onShare?: () => void;
  articleId?: string;
}

export const ShareAction: React.FC<ShareActionProps> = ({ onShare, articleId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    
    // Default share behavior if no custom handler is provided
    if (navigator.share) {
      try {
        navigator.share({
          title: "Article partagé depuis InfoCHIR",
          url: window.location.origin + (articleId ? `/articles/${articleId}` : location.pathname),
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    const shareUrl = window.location.origin + (articleId ? `/articles/${articleId}` : location.pathname);
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success("Lien copié dans le presse-papier"))
      .catch(err => toast.error("Erreur lors de la copie du lien"));
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4" />
      Partager
    </Button>
  );
};
