
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Issue } from "./types";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardActions } from "./components/card/IssueCardActions";
import { IssueModal } from "@/components/shared/DocumentModal";
import { motion } from "framer-motion";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card 
          className="overflow-hidden group cursor-pointer h-full flex border border-gray-200 hover:shadow-md transition-all"
          onClick={() => setModalOpen(true)}
        >
          <div className="shrink-0 w-1/3 md:w-1/4 h-full">
            <IssueCardCover image={issue.coverImage} />
          </div>
          
          <div className="flex-1 flex flex-col p-4">
            <div className="flex-1">
              <IssueCardContent issue={issue} />
            </div>
            
            <div className="flex justify-end mt-2">
              <IssueCardActions 
                pdfUrl={issue.pdfUrl} 
                id={issue.id}
                title={issue.title}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      <IssueModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={issue.title}
        content={issue.abstract}
        documentUrl={issue.pdfUrl}
        metadata={{
          volume: issue.volume,
          issue: issue.issue,
          date: issue.date,
          articles: issue.articleCount
        }}
      />
    </>
  );
};
