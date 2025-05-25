
import { Calendar, BookOpen, Download, Share } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Issue } from "../../types";

interface IssueModalMetadataProps {
  issue: Issue;
}

export const IssueModalMetadata = ({ issue }: IssueModalMetadataProps) => {
  return (
    <div className="flex items-center gap-4 text-[clamp(0.875rem,0.825rem+0.25vw,1rem)] text-gray-500 flex-wrap">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {format(new Date(issue.date), 'dd MMMM yyyy', { locale: fr })}
      </div>
      <div className="flex items-center gap-2 bg-secondary/5 px-3 py-1 rounded-full">
        <BookOpen className="h-4 w-4" />
        {issue.articleCount || (issue.articles?.length) || 0} articles
      </div>
      <div className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        {(issue.downloads || issue.downloadCount) || 0} téléchargements
      </div>
      <div className="flex items-center gap-2">
        <Share className="h-4 w-4" />
        {(issue.shares || issue.shareCount) || 0} partages
      </div>
    </div>
  );
};
