import { DocumentModal } from "@/components/shared/DocumentModal";
import type { Issue } from "./types";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
}

export const IssueModal = ({ issue, isOpen, onClose }: IssueModalProps) => {
  const renderContent = (document: Issue) => (
    <div className="space-y-4">
      <h3 className="text-[clamp(1.125rem,1.075rem+0.25vw,1.25rem)] font-semibold text-primary">
        Table des matières
      </h3>
      {document.articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
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
            <p className="mt-2 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-600 leading-relaxed">
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
        </motion.div>
      ))}
    </div>
  );

  return (
    <DocumentModal
      document={{
        id: issue.id,
        title: issue.title,
        date: issue.date,
        description: issue.abstract,
        articleCount: issue.articleCount,
        downloadCount: issue.downloads,
        shareCount: issue.shares,
        pdfUrl: issue.pdfUrl,
        coverImage: issue.coverImage,
      }}
      open={isOpen}
      onClose={onClose}
      renderContent={() => renderContent(issue)}
    />
  );
};