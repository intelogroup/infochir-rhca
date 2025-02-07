
import { DocumentModal } from "@/components/shared/DocumentModal";
import type { Article } from "../types";
import { Tag } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleModalProps {
  article: Article;
  open: boolean;
  onClose: () => void;
}

export const ArticleModal = ({ article, open, onClose }: ArticleModalProps) => {
  const renderContent = (document: Article) => (
    <div className="space-y-6">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{format(new Date(document.date), 'dd MMMM yyyy', { locale: fr })}</span>
            <span>•</span>
            <span>{document.source}</span>
            {document.category && (
              <>
                <span>•</span>
                <span>{document.category}</span>
              </>
            )}
          </div>
          
          {document.authors && document.authors.length > 0 && (
            <div className="text-gray-700 font-medium">
              {document.authors.join(", ")}
            </div>
          )}
          
          <p className="text-gray-600">{document.abstract}</p>
          
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {document.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DocumentModal
      document={{
        id: article.id,
        title: article.title,
        date: article.date,
        abstract: article.abstract,
        downloadCount: article.downloads,
        shareCount: 0,
        pdfUrl: article.pdfUrl,
        coverImage: article.imageUrl,
      }}
      open={open}
      onClose={onClose}
      renderContent={renderContent}
    />
  );
};
