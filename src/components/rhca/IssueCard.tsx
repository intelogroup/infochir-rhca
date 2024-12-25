import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { PDFViewer } from "./PDFViewer";

interface IssueCardProps {
  id: string;
  title: string;
  volume?: string;
  issue?: string;
  date: string;
  articleCount?: number;
  pdfUrl?: string;
}

export const IssueCard = ({ 
  title, 
  volume, 
  issue, 
  date, 
  articleCount,
  pdfUrl 
}: IssueCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-shadow transform scale-90 origin-left">
      <CardHeader className="p-3">
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium text-primary truncate">
              {title}
            </CardTitle>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="whitespace-nowrap">
                {volume} • {issue}
              </span>
              <span className="text-primary">|</span>
              <Calendar className="h-3 w-3" />
              <span>{new Date(date).toLocaleDateString()}</span>
              {articleCount && (
                <>
                  <span className="text-primary">|</span>
                  <span>{articleCount} articles</span>
                </>
              )}
            </div>
          </div>
          <PDFViewer pdfUrl={pdfUrl || null} title={title} />
        </div>
      </CardHeader>
    </Card>
  );
};