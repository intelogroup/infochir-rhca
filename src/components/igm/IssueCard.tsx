
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Issue } from "./types";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardActions } from "./components/card/IssueCardActions";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { DocumentModal } from "@/components/shared/DocumentModal";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only open the modal if clicking the card itself, not the buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="h-full flex"
      >
        <Card 
          className="overflow-hidden group cursor-pointer h-full flex flex-row w-full border border-gray-200 hover:shadow-md transition-all"
          onClick={handleCardClick}
        >
          <div className={`shrink-0 ${isMobile ? 'w-1/3' : 'w-1/3 md:w-1/4'} h-full`}>
            <div className="h-full">
              <IssueCardCover coverImage={issue.coverImage} title={issue.title} />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col p-2 sm:p-4">
            <div className="flex-1">
              <IssueCardContent issue={issue} />
            </div>
            
            <div className={`flex ${isMobile ? 'mt-1' : 'mt-2'} justify-end`}>
              <IssueCardActions 
                pdfUrl={issue.pdfUrl} 
                id={issue.id}
                title={issue.title}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      <DocumentModal
        document={{
          id: issue.id,
          title: issue.title,
          date: issue.date,
          description: issue.description || issue.abstract,
          articleCount: issue.articleCount || 0,
          downloadCount: issue.downloadCount || 0,
          shareCount: issue.shareCount || 0,
          coverImage: issue.coverImage,
          pdfUrl: issue.pdfUrl
        }}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        renderActions={(document) => (
          <IssueCardActions 
            pdfUrl={document.pdfUrl} 
            id={document.id}
            title={document.title}
          />
        )}
      />
    </>
  );
};
