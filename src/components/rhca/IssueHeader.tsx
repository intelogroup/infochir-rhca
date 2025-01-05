import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface IssueHeaderProps {
  title: string;
  volume: string;
  issueNumber: string;
  date: string;
}

export const IssueHeader = ({ title, volume, issueNumber, date }: IssueHeaderProps) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/5 rounded-full">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
            <p className="text-gray-600">
              {volume} No. {issueNumber} • {date}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};