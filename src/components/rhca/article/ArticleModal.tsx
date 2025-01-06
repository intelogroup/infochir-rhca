import { DocumentModal } from "@/components/shared/DocumentModal";
import { Tag } from "lucide-react";
import type { RhcaArticle } from "../types";

interface ArticleModalProps {
  article: RhcaArticle;
  open: boolean;
  onClose: () => void;
}

export const ArticleModal = ({ article, open, onClose }: ArticleModalProps) => {
  const renderContent = (document: RhcaArticle) => (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h3 className="text-lg font-semibold text-primary">Résumé</h3>
        <p className="text-gray-600 dark:text-gray-300">{document.abstract}</p>
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
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
  );

  return (
    <DocumentModal
      document={{
        id: article.id,
        title: article.title,
        date: article.date,
        description: `Par ${article.authors.join(", ")}`,
        downloadCount: parseInt(article.downloads || "0"),
        shareCount: parseInt(article.shares || "0"),
        pdfUrl: article.pdfUrl,
        coverImage: article.imageUrl,
      }}
      open={open}
      onClose={onClose}
      renderContent={() => renderContent(article)}
    />
  );
};