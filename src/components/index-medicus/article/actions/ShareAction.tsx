
import React, { useState } from "react";
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { createLogger } from "@/lib/error-logger";

const logger = createLogger('ShareAction');

interface ShareActionProps {
  onShare?: () => void;
  articleId?: string;
  articleTitle?: string;
}

export const ShareAction: React.FC<ShareActionProps> = ({ 
  onShare, 
  articleId,
  articleTitle = "Article Index Medicus"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  const getShareUrl = () => {
    return window.location.origin + (articleId ? `/index-medicus/articles/${articleId}` : location.pathname);
  };
  
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: articleTitle,
          text: `Découvrez "${articleTitle}" sur InfoCHIR`,
          url: getShareUrl(),
        });
        
        trackShare();
        toast.success("Contenu partagé avec succès");
      } else {
        // Fall back to dropdown menu which will stay open if no native sharing
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        logger.error("Share error:", error);
        toast.error("Erreur lors du partage");
      }
      return false;
    }
    return true;
  };

  const trackShare = async () => {
    if (!articleId) return;
    
    try {
      await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'shares',
        row_id: articleId
      });
    } catch (error) {
      logger.error("Failed to track share:", error);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      setIsLoading(true);
      await navigator.clipboard.writeText(getShareUrl());
      trackShare();
      toast.success("Lien copié dans le presse-papier");
    } catch (error) {
      logger.error("Copy error:", error);
      toast.error("Erreur lors de la copie du lien");
    } finally {
      setIsLoading(false);
    }
  };
  
  const shareToSocial = (platform: string) => {
    const url = getShareUrl();
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(articleTitle);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
      trackShare();
    }
  };
  
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    
    // Try native sharing first
    const nativeShareSucceeded = await handleNativeShare();
    
    // If native sharing is not available or was cancelled, the dropdown will handle it
    if (!nativeShareSucceeded) {
      // The dropdown menu will stay open for user to select another option
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => handleNativeShare()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span>Partager</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" />
          Copier le lien
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('linkedin')}>
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('email')}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
