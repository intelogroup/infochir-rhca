import { DocumentModal } from "@/components/shared/DocumentModal";
import { Tag } from "lucide-react";
import type { RhcaVolume } from "../types";

interface VolumeModalProps {
  volume: RhcaVolume;
  open: boolean;
  onClose: () => void;
  title: string;
}

export const VolumeModal = ({ volume, open, onClose, title }: VolumeModalProps) => {
  const renderContent = (document: RhcaVolume) => (
    <div className="space-y-4">
      <h3 className="text-[clamp(1.125rem,1.075rem+0.25vw,1.25rem)] font-semibold text-primary">
        Table des matières
      </h3>
      {document.articles.map((article) => (
        <div
          key={article.id}
          className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <h4 className="font-medium text-[clamp(1rem,0.95rem+0.25vw,1.125rem)] text-gray-900 mb-2">
            {article.title}
          </h4>
          <div className="flex flex-wrap gap-4 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-500">
            <div className="flex items-center gap-2">
              <span>Page {article.pageNumber}</span>
            </div>
            <div>
              {article.authors.join(", ")}
            </div>
          </div>
          {article.abstract && (
            <p className="mt-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600">
              {article.abstract}
            </p>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {article.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[clamp(0.75rem,0.7rem+0.25vw,0.875rem)] font-medium bg-primary/10 text-primary"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <DocumentModal
      document={{
        id: volume.id,
        title: title,
        date: volume.date,
        description: volume.description,
        articleCount: volume.articles.length,
        downloadCount: volume.downloadCount,
        shareCount: volume.shareCount,
        pdfUrl: volume.articles[0]?.pdfUrl,
        coverImage: volume.coverImage,
      }}
      open={open}
      onClose={onClose}
      renderContent={() => renderContent(volume)}
    />
  );
};