import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        className="hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute inset-0">
          {issue.coverImage ? (
            <img 
              src={issue.coverImage}
              alt={`Couverture ${issue.title}`}
              className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <CardHeader className="relative z-10">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                {issue.title}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {issue.volume} - {issue.issue}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">
                  {format(new Date(issue.date), 'MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-gray-600 mb-4 line-clamp-2">
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
        </CardContent>
      </Card>

      <IssueModal
        issue={issue}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};