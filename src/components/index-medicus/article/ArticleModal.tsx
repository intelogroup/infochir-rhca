
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Article } from "../types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleModalProps {
  article: Article;
  open: boolean;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  open,
  onClose,
}) => {
  const formattedDate = format(new Date(article.publicationDate), "PPP", { locale: fr });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {article.title}
          </DialogTitle>
          <DialogDescription>
            Publié le {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-600">{article.abstract}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Auteurs</h4>
            <p>{article.authors.join(", ")}</p>
          </div>

          {article.institution && (
            <div>
              <h4 className="font-semibold mb-2">Institution</h4>
              <p>{article.institution}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
