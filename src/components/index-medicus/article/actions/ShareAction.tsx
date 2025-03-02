
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareActionProps {
  onShare: () => void;
}

export const ShareAction: React.FC<ShareActionProps> = ({ onShare }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={onShare}
    >
      <Share2 className="h-4 w-4" />
      Partager
    </Button>
  );
};
