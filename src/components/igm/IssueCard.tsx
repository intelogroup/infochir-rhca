
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Issue } from "./types";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardActions } from "./components/card/IssueCardActions";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { IGMIssueModal } from "./components/modal/IGMIssueModal";

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

  // Calculate total pages from articles
  const getTotalPages = (() => {
    try {
      // If pageCount is directly available, use it
      if (issue.pageCount && typeof issue.pageCount === 'number') {
        return `${issue.pageCount} Pages`;
      }
      
      // Check if we can extract page information from articles
      if (!issue.articles || issue.articles.length === 0) {
        return "- Pages";
      }
      
      let maxPage = 0;
      
      // Loop through all articles to find the highest page number
      issue.articles.forEach(article => {
        if (!article.pageNumber) return;
        
        const pageNumber = article.pageNumber.toString().trim();
        
        // Handle page range format (e.g., "1-28")
        if (pageNumber.includes('-')) {
          const [start, end] = pageNumber.split('-').map(num => parseInt(num.trim(), 10));
          if (!isNaN(end) && end > maxPage) {
            maxPage = end;
          }
        } 
        // Handle single page format (e.g., "34")
        else {
          const pageNum = parseInt(pageNumber, 10);
          if (!isNaN(pageNum) && pageNum > maxPage) {
            maxPage = pageNum;
          }
        }
      });
      
      return maxPage > 0 ? `${maxPage} Pages` : "- Pages";
      
    } catch (error) {
      console.error('Error calculating total pages:', error);
      return "- Pages";
    }
  })();

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
        className="h-full flex"
      >
        <Card 
          className="overflow-hidden group cursor-pointer h-full flex flex-col w-full border border-gray-200 hover:shadow-md transition-all max-w-[280px]"
          onClick={handleCardClick}
        >
          <div className="h-24 w-full">
            <IssueCardCover coverImage={issue.coverImage} title={issue.title} />
          </div>
          
          <div className="flex-1 flex flex-col p-1.5 min-h-0">
            <div className="flex-1 min-h-0">
              <IssueCardContent issue={issue} />
            </div>
            
            {/* Actions and page info section */}
            <div className="mt-1">
              <div className="flex items-center justify-between gap-1">
                <span className="bg-amber-50 px-1 py-0.5 rounded border border-amber-200 font-medium text-[9px] text-amber-700">
                  {getTotalPages}
                </span>
                
                <div className="flex justify-end">
                  <IssueCardActions 
                    pdfUrl={issue.pdfUrl} 
                    id={issue.id}
                    title={issue.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <IGMIssueModal
        issue={issue}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
