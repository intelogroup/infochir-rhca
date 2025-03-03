
import React from "react";
import { Card } from "@/components/ui/card";
import { Issue } from "./types";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardActions } from "./components/card/IssueCardActions";
import { motion } from "framer-motion";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden group cursor-pointer h-full flex border border-gray-200 hover:shadow-md transition-all"
      >
        <div className="shrink-0 w-1/3 md:w-1/4 h-full">
          <IssueCardCover coverImage={issue.coverImage} title={issue.title} />
        </div>
        
        <div className="flex-1 flex flex-col p-3">
          <div className="flex-1">
            <IssueCardContent issue={issue} />
          </div>
          
          <div className="flex justify-end mt-1">
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
