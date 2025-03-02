
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Article } from "../../types";
import { useNavigate } from "react-router-dom";

interface ViewActionProps {
  article?: Article;
  showViewButton?: boolean;
}

export const ViewAction: React.FC<ViewActionProps> = ({ article, showViewButton = false }) => {
  const navigate = useNavigate();
  
  if (!showViewButton || !article) {
    return null;
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => navigate(`/articles/${article.id}`)}
    >
      <ExternalLink className="h-4 w-4" />
      Voir
    </Button>
  );
};
