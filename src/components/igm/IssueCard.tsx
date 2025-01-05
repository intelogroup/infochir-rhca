import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { IssueModal } from "./IssueModal";
import type { Issue } from "./types";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex">
          <div className="w-32 h-44 flex-shrink-0 overflow-hidden">
            {issue.coverImage ? (
              <img 
                src={issue.coverImage}
                alt={`Couverture ${issue.title}`}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No cover</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {issue.volume} - {issue.issue}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">
                    {format(new Date(issue.date), 'MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 line-clamp-2">
                {issue.abstract}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {issue.articleCount} articles
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {issue.downloads || 0}
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  {issue.shares || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <IssueModal
        issue={issue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};