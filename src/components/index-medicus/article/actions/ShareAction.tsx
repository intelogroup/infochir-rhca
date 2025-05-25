
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
  pdfUrl?: string;
  pdfFilename?: string;
}

export const ShareAction: React.FC<ShareActionProps> = ({ 
  onShare, 
  articleId,
  articleTitle = "Article Index Medicus",
  pdfUrl,
  pdfFilename
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  const getShareUrl = () => {
    // Prioritize direct PDF link if available
    if (pdfUrl && pdfUrl.includes('supabase.co')) {
      return pdfUrl;
    }
    
    // Generate direct PDF URL using filename
    if (pdfFilename) {
      return `https://llxzstqejdrplmxdjxlu.supabase.co/storage/v1/object/public/indexmedicuspdf/${pdfFilename}`;
    }
    
    // Fallback to article page
    return window.location.origin + (articleId ? `/index-medicus/articles/${articleId}` : location.pathname);
  };
  
  const handleNativeShare = async () => {
    try {
      const shareUrl = getShareUrl();
      const isPdfLink = shareUrl.includes('.pdf');
      
      if (navigator.share) {
        await navigator.share({
          title: articleTitle,
          text: isPdfLink ? `PDF: "${articleTitle}"` : `Découvrez "${articleTitle}" sur InfoCHIR`,
          url: shareUrl,
        });
        
        trackShare();
        toast.success("Contenu partagé avec succès");
        return true;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        logger.error("Share error:", error);
        toast.error("Erreur lors du partage");
      }
    }
    return false;
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
      const shareUrl = getShareUrl();
      await navigator.clipboard.writeText(shareUrl);
      trackShare();
      
      const isPdfLink = shareUrl.includes('.pdf');
      toast.success(isPdfLink ? "Lien PDF copié dans le presse-papier" : "Lien copié dans le presse-papier");
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
    const isPdfLink = url.includes('.pdf');
    const shareText = isPdfLink ? `PDF: ${articleTitle}` : articleTitle;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodedUrl}`;
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
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <Copy className="h-4 w-4 mr-2" />
          Copier le lien PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem onClick={() => shareToSocial('facebook')} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('twitter')} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('linkedin')} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareToSocial('email')} className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
