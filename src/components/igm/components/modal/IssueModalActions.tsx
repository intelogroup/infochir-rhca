
import { Button } from "@/components/ui/button";
import { Share2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import type { Issue } from "../../types";
import { createLogger } from "@/lib/error-logger";
import { ShareAction } from "@/components/shared/actions/ShareAction";
import { DownloadAction } from "@/components/shared/actions/DownloadAction";
import { OpenAction } from "@/components/shared/actions/OpenAction";

const logger = createLogger('IssueModalActions');

interface IssueModalActionsProps {
  issue: Issue;
}

export const IssueModalActions = ({ issue }: IssueModalActionsProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = `${window.location.origin}/igm/issues/${issue.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      const { error } = await supabase.rpc('increment_count', {
        table_name: 'articles',
        column_name: 'shares',
        row_id: issue.id
      });

      if (error) {
        logger.error('Error updating share count:', error);
      }
      
      toast.success("Lien copié dans le presse-papier", {
        className: "bg-secondary text-white",
      });
    } catch (error) {
      logger.error('Error sharing:', error);
      toast.error("Erreur lors du partage");
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] hover:bg-secondary/10 hover:text-secondary transition-colors"
        onClick={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        Partager
      </Button>
      
      {issue.pdfUrl && (
        <>
          <OpenAction
            id={issue.id}
            pdfUrl={issue.pdfUrl}
            size="sm"
            variant="outline"
            className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] hover:bg-secondary/10 hover:text-secondary transition-colors"
          />
          
          <DownloadAction
            id={issue.id}
            title={issue.title}
            pdfUrl={issue.pdfUrl}
            contentType="igm"
            size="sm"
            variant="default"
            className="gap-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] bg-secondary hover:bg-secondary-light transition-colors"
          />
        </>
      )}
    </div>
  );
};
