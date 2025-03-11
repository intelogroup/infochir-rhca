
import React from "react";
import { Card } from "@/components/ui/card";
import { Issue } from "./types";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardActions } from "./components/card/IssueCardActions";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full flex"
    >
      <Card 
        className="overflow-hidden group cursor-pointer h-full flex flex-row w-full border border-gray-200 hover:shadow-md transition-all"
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
  );
};
