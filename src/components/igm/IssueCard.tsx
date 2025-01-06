import { Card } from "@/components/ui/card";
import type { Issue } from "./types";
import { motion } from "framer-motion";
import { useState } from "react";
import { IssueModal } from "./IssueModal";
import { IssueCardCover } from "./components/card/IssueCardCover";
import { IssueCardContent } from "./components/card/IssueCardContent";
import { IssueCardActions } from "./components/card/IssueCardActions";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full w-full"
      >
        <Card 
          className="group hover:shadow-md transition-all duration-300 cursor-pointer h-full transform hover:-translate-y-1 bg-white border border-gray-200"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex gap-4 p-4">
            <div className="w-20 flex-shrink-0">
              <IssueCardCover 
                coverImage={issue.coverImage}
                title={issue.title}
              />
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <IssueCardContent issue={issue} />
                <div className="hidden sm:block">
                  <IssueCardActions
                    pdfUrl={issue.pdfUrl}
                    id={issue.id}
                    onViewDetails={() => setIsModalOpen(true)}
                  />
                </div>
              </div>
              <div className="mt-3 sm:hidden">
                <IssueCardActions
                  pdfUrl={issue.pdfUrl}
                  id={issue.id}
                  onViewDetails={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <IssueModal 
        issue={issue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};