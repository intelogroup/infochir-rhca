
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Issue } from "./types";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardActions } from "./components/card/IssueCardActions";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { IGMIssueModal } from "./components/modal/IGMIssueModal";
import { trackClick } from "@/lib/analytics/track";
import { DocumentType } from "@/lib/analytics/download/statistics/types";


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

    void trackClick(issue.id, DocumentType.IGM, issue.title);
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
        className="h-full flex"
      >
        <Card
          className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-none border border-border bg-card transition-colors hover:border-primary/40"
          onClick={handleCardClick}
        >
          <IssueCardCover coverImage={issue.coverImage} title={issue.title} />

          <div className="flex min-h-0 flex-1 flex-col p-4">
            <IssueCardContent issue={issue} />

            <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-border pt-2">
              <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                {getTotalPages === "- Pages" || getTotalPages === "1 Pages"
                  ? ""
                  : getTotalPages.replace("Pages", "pages")}
              </span>
              <IssueCardActions pdfUrl={issue.pdfUrl} id={issue.id} title={issue.title} />
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
