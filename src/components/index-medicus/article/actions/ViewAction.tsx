
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Article } from "../../types";

interface ViewActionProps {
  article?: Article;
  showViewButton?: boolean;
}

export const ViewAction: React.FC<ViewActionProps> = ({ article, showViewButton = false }) => {
  if (!showViewButton || !article) {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => window.location.href = `/articles/${article.id}`}
    >
      <ExternalLink className="h-4 w-4" />
      Voir
    </Button>
  );
};
